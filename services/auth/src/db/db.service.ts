import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import {
  CreateLoginDTO,
  DeleteLoginDTO,
  LoginDTO,
  UpdateLoginDTO,
} from '../types/login';
import { plainToClass } from '@nestjs/class-transformer';
import { getHashedPassword } from '../utils/password';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'auth';

  private table = 'logins';

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
    await schema.dropTableIfExists(this.table);

    await schema.createTable(this.table, (qb) => {
      qb.uuid('uid').primary().defaultTo(this._knex.raw('uuid_generate_v4()'));
      qb.uuid('employee');
      qb.string('email').notNullable().unique();
      qb.string('name').notNullable();
      qb.string('password').notNullable();
      qb.string('role').notNullable();
    });

    console.log('table created', this.table);

    await this.q().insert([
      {
        email: 'admin@po.pug',
        name: 'admin',
        role: 'admin',
        password: getHashedPassword('admin'),
      },
    ]);
  }

  public async createLogin(
    loginDto: CreateLoginDTO,
    trx?: Knex.Transaction,
  ): Promise<LoginDTO> {
    const login = await this.q(trx).insert(loginDto).returning('*');

    return plainToClass(LoginDTO, login[0]);
  }

  public async updateLogin(
    loginDto: UpdateLoginDTO,
    trx?: Knex.Transaction,
  ): Promise<LoginDTO> {
    const { employee, ...data } = loginDto;
    const login = await this.q(trx)
      .update(data)
      .where({ employee })
      .returning('*');

    return plainToClass(LoginDTO, login[0]);
  }

  public async deleteLogin(
    loginDto: DeleteLoginDTO,
    trx?: Knex.Transaction,
  ): Promise<LoginDTO> {
    const { employee } = loginDto;
    const login = await this.q(trx).delete().where({ employee }).returning('*');

    return plainToClass(LoginDTO, login[0]);
  }

  public async getLogin(
    email: string,
    trx?: Knex.Transaction,
  ): Promise<LoginDTO | undefined> {
    const logins = await this.q(trx).select('*').where({ email });

    return plainToClass(LoginDTO, logins[0]);
  }

  public async tRun<X>(fn: (trx: Knex.Transaction) => Promise<X>): Promise<X> {
    const trx = await this.trx();
    try {
      const result = await fn(trx);
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
    table?: string,
  ): Knex.QueryBuilder<Rec, Res> {
    return trx
      ? (trx(table || this.table).withSchema(
          this.schemaName,
        ) as Knex.QueryBuilder<Rec, Res>)
      : (this._knex(table || this.table).withSchema(
          this.schemaName,
        ) as Knex.QueryBuilder<Rec, Res>);
  }
}
