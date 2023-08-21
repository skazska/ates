import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'accounting';

  private table = 'accounting';

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

    await schema.dropTableIfExists('tasks');

    await schema.createTable('tasks', (qb) => {
      qb.uuid('assignee');
      qb.text('description');
      qb.string('status');
      qb.string('title');
      qb.decimal('reward', 9, 2);
      qb.decimal('fee', 9, 2);
      qb.uuid('uid').notNullable().primary();
    });

    await schema.dropTableIfExists('employees');

    await schema.createTable('employees', (qb) => {
      qb.decimal('balance', 9, 2).notNullable().defaultTo(0);
      qb.string('name').notNullable();
      qb.string('role').notNullable();
      qb.uuid('uid').primary().notNullable().primary();
    });

    await schema.dropTableIfExists(this.table);

    await schema.createTable(this.table, (qb) => {
      qb.decimal('amount', 9, 2);
      qb.date('date').notNullable().defaultTo(this._knex.fn.now());
      qb.uuid('employee').references('uid').inTable('employees');
      qb.uuid('task').references('uid').inTable('tasks');
      qb.string('type').notNullable();
      qb.uuid('uid')
        .primary()
        .notNullable()
        .defaultTo(this._knex.raw('uuid_generate_v4()'));
    });
  }

  public async getEmployees(trx?: Knex.Transaction): Promise<string[]> {
    const rows = await this.q<{ uid: string }>(trx, 'employees').select('uid');

    return rows.map((row) => row.uid);
  }

  public async transaction(
    record: { employee: string; task?: string; type: string; amount: number },
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.q(trx).insert(record);
  }

  public async getBalance(
    employee: string,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const rows = await this.q<{ balance: number }>(trx, 'employees')
      .select('balance')
      .where('uid', employee);

    return rows[0]?.balance || 0;
  }

  public async getAccounting(
    employee?: string,
    trx?: Knex.Transaction,
  ): Promise<
    {
      amount: number;
      date: Date;
      employee: string;
      type: string;
      task?: string;
    }[]
  > {
    const q = this.q<{
      amount: number;
      date: Date;
      employee: string;
      type: string;
      task?: string;
    }>(trx)
      .select('*')
      .orderBy('date', 'desc');

    if (employee) {
      void q.where('employee', employee);
    }

    return q;
  }

  public async setBalance(
    employee: string,
    balance: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.q(trx, 'employees')
      .insert({ uid: employee, balance })
      .onConflict('uid')
      .merge({ balance });
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
