import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { LoginDTO } from '../types/login';
import { plainToClass } from '@nestjs/class-transformer';
import { getHashedPassword } from '../utils/password';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'auth';

  private logins = 'logins';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async init(): Promise<void> {
    try {
      await this._knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    } catch (e) {
      console.error(e);
    }

    let schema = this._knex.schema;
    await schema.dropSchemaIfExists(this.schemaName, true);
    await schema.createSchemaIfNotExists(this.schemaName);

    console.log('schema', this.schemaName);

    schema = schema.withSchema(this.schemaName);
    await schema.dropTableIfExists(this.logins);

    await schema.createTable(this.logins, (qb) => {
      qb.uuid('uid').primary().defaultTo(this._knex.raw('uuid_generate_v4()'));
      qb.string('name').notNullable();
      qb.string('email').notNullable().unique();
      qb.string('password').notNullable();
      qb.string('role').notNullable();
    });

    console.log('table created', this.logins);

    await this.q()
      .insert([
        {
          email: 'admin@po.pug',
          name: 'admin',
          role: 'admin',
          password: getHashedPassword('admin'),
        },
      ])
      .into(this.logins);
  }

  public async createLogin(loginDto: LoginDTO): Promise<LoginDTO> {
    const login = await this.q()
      .into(this.logins)
      .insert(loginDto)
      .returning('*');

    return plainToClass(LoginDTO, login[0]);
  }

  public async getLogin(email: string): Promise<LoginDTO | undefined> {
    const logins = await this.q()
      .select('*')
      .from(this.logins)
      .where({ email });

    return plainToClass(LoginDTO, logins[0]);
  }

  public async tRun<X>(fn: () => Promise<X>): Promise<X> {
    const trx = await this.trx();
    try {
      const result = await fn();
      await trx.commit();
      return result;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  protected trx(): Promise<Knex.Transaction> {
    return this._knex.transaction();
  }

  protected q<Rec extends object, Res = Rec[]>(
    trx?: Knex.Transaction<Rec, Res>,
  ): Knex.QueryBuilder<Rec, Res> {
    return trx
      ? trx.withSchema(this.schemaName)
      : (this._knex().withSchema(this.schemaName) as Knex.QueryBuilder<
          Rec,
          Res
        >);
  }
}
