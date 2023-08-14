import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { LoginDTO } from '../types/login';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'auth';

  private logins = 'logins';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async init(): Promise<void> {
    await this._knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    let schema = this._knex.schema;
    await schema.dropSchemaIfExists(this.schemaName, true);
    await schema.createSchemaIfNotExists(this.schemaName);

    console.log('schema', this.schemaName);

    schema = schema.withSchema(this.schemaName);
    await schema.dropTableIfExists(this.logins);

    await schema.createTable(this.logins, (qb) => {
      qb.uuid('uuid').primary().defaultTo(this._knex.raw('uuid_generate_v4()'));
      qb.string('name').notNullable();
      qb.string('email').notNullable();
      qb.string('password').notNullable();
      qb.string('role').notNullable();
    });

    console.log('table created', this.logins);

    await this.q()
      .insert({
        email: 'admin@admin.admin',
        name: 'admin',
        role: 'admin',
        password: '',
      })
      .into(this.logins);
  }

  public async createLogin(loginDto: LoginDTO): Promise<LoginDTO> {
    const login = await this.q()
      .into(this.logins)
      .insert(loginDto)
      .returning('*');

    return plainToClass(LoginDTO, login[0]);
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

  protected q(trx?: Knex.Transaction): Knex.QueryBuilder {
    return trx
      ? trx.withSchema(this.schemaName)
      : this._knex().withSchema(this.schemaName);
  }
}
