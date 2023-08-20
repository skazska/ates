import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import {
  NewEmployeeDTO,
  EmployeeDTO,
  UpdateEmployeeDTO,
  DeleteEmployeeDTO,
} from '../types/employee';
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'employees';

  private table = 'employees';

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
      qb.uuid('uid')
        .primary()
        .notNullable()
        .defaultTo(this._knex.raw('uuid_generate_v4()'));
      qb.string('name').notNullable();
      qb.string('email').notNullable().unique();
      qb.string('role').notNullable();
    });

    console.log('table created', this.schemaName);
  }

  public async createEmployee(
    employeeDTO: NewEmployeeDTO,
    trx?: Knex.Transaction,
  ): Promise<EmployeeDTO> {
    const rec: Record<string, unknown> = { ...employeeDTO };
    delete rec.password;

    const result = await this.q(trx).insert(rec).returning('*');

    return plainToClass(EmployeeDTO, result[0]);
  }

  public async updateEmployee(
    employeeDTO: UpdateEmployeeDTO,
    trx?: Knex.Transaction,
  ): Promise<EmployeeDTO> {
    const { uid, ...rec } = employeeDTO;

    const result = await this.q(trx)
      .update(rec)
      .where('uid', uid)
      .returning('*');

    return plainToClass(EmployeeDTO, result[0]);
  }

  public async deleteEmployee(
    employeeDto: DeleteEmployeeDTO,
    trx?: Knex.Transaction,
  ): Promise<EmployeeDTO> {
    const result = await this.q(trx)
      .delete()
      .where('uid', employeeDto.uid)
      .returning('*');

    return plainToClass(EmployeeDTO, result[0]);
  }

  public async getEmployee(
    uid?: string,
    trx?: Knex.Transaction,
  ): Promise<EmployeeDTO[]> {
    const q = this.q(trx).select(['email', 'name', 'uid']);

    if (uid) {
      void q.where('uid', uid);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: unknown[] = await q;

    return plainToClass(EmployeeDTO, result);
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
