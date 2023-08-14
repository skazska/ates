import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { NewEmployeeDTO, EmployeeDTO } from '../types/employee';
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

  public async createEmployee(user: NewEmployeeDTO): Promise<EmployeeDTO> {
    const result = await this.q(this.employees).insert(user).returning('*');

    return plainToClass(EmployeeDTO, result[0]);
  }

  public async getEmployee(uid?: string): Promise<EmployeeDTO[]> {
    const q = this.q()
      .select(['email', 'name', 'uid'])
      .from(this.employees);

    if (uid) {
      void q.where('uid', uid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: unknown[] = await q;

    return plainToClass(EmployeeDTO, result);
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
