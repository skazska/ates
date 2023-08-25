import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { NewTaskDTO, TaskDTO, UpdateTaskDTO } from '../types/task';
import { classToPlain, plainToClass } from '@nestjs/class-transformer';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'tasks';

  private table = 'tasks';

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
    await schema.dropTableIfExists('employees');
    await schema.dropTableIfExists('tasks');

    await schema.createTable('employees', (qb) => {
      qb.string('name').notNullable();
      qb.string('role').notNullable();
      qb.uuid('uid').primary().notNullable().primary();
    });

    await schema.createTable('tasks', (qb) => {
      qb.uuid('assignee')
        .notNullable()
        .references('uid')
        .inTable(`${this.schemaName}.employees`)
        .onDelete('CASCADE');
      qb.string('description').notNullable();
      qb.string('status').notNullable();
      qb.string('title').notNullable();
      qb.uuid('uid')
        .primary()
        .notNullable()
        .defaultTo(this._knex.raw('uuid_generate_v4()'));
    });

    console.log('table created', this.schemaName);
  }

  public async createTask(
    taskDTO: NewTaskDTO,
    assignee: string,
    trx?: Knex.Transaction,
  ): Promise<TaskDTO> {
    const rec: Record<string, unknown> = classToPlain(taskDTO);

    console.dir(rec);

    const result = await this.q(trx)
      .insert({ ...rec, assignee, status: 'assigned' })
      .returning('*');

    return plainToClass(TaskDTO, result[0]);
  }

  public async updateTask(
    taskDTO: UpdateTaskDTO,
    trx?: Knex.Transaction,
  ): Promise<TaskDTO> {
    const { uid, ...rec } = taskDTO;

    const result = await this.q(trx)
      .update(rec)
      .where('uid', uid)
      .returning('*');

    return plainToClass(TaskDTO, result[0]);
  }

  public async getEmployees(trx?: Knex.Transaction): Promise<EmployeeDTO[]> {
    const result = await this.q<EmployeeDTO>(trx, 'employees').select('*');

    return plainToClass(EmployeeDTO, result);
  }

  public async completeTask(
    taskDTO: UpdateTaskDTO,
    employeeUid: string,
    trx?: Knex.Transaction,
  ): Promise<TaskDTO> {
    const { uid, ...rec } = taskDTO;

    const result = await this.q(trx)
      .update({ ...rec, status: 'completed' })
      .where('uid', uid)
      .andWhere('assignee', employeeUid)
      .andWhere('status', 'assigned')
      .returning('*');

    return plainToClass(TaskDTO, result[0]);
  }

  public async getTasks(
    employee?: string,
    trx?: Knex.Transaction,
  ): Promise<TaskDTO[]> {
    const q = this.q(trx)
      .select(['assignee', 'description', 'status', 'title', 'uid'])
      .whereNot('status', 'completed');

    if (employee) {
      void q.where('assignee', employee);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: unknown[] = await q;

    return plainToClass(TaskDTO, result);
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
