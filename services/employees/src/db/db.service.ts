import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { NewUserDTO, UserDTO } from '../types/user';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'employees';

  private employees = 'employees';

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
    await schema.dropTableIfExists(this.employees);

    await schema.createTable('employees', (qb) => {
      qb.uuid('uid')
        .primary()
        .notNullable()
        .defaultTo(this._knex.raw('uuid_generate_v4()'));
      qb.string('name').notNullable();
      qb.string('email').notNullable();
      qb.string('password').notNullable();
    });

    console.log('table created', this.schemaName);
  }

  public async createUser(user: NewUserDTO): Promise<UserDTO> {
    const result = await this.q(this.employees).insert(user).returning('*');

    return plainToClass(UserDTO, result[0]);
  }

  public async getUsers(uid?: string): Promise<UserDTO[]> {
    const q = this.q(this.employees).select(['email', 'name', 'uid']);

    if (uid) {
      void q.where('uid', uid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: unknown[] = await q;

    return plainToClass(UserDTO, result);
  }

  protected q(table?: string): Knex.QueryBuilder {
    return this._knex(table).withSchema(this.schemaName);
  }
}
