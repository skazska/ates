import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { TaskDTO } from '../types/task';

@Injectable()
export class TaskDbService {
  private _knex: Knex;

  private schemaName = 'accounting';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async create(task: TaskDTO): Promise<void> {
    await this.q().insert(task);
  }

  public async update(task: TaskDTO): Promise<void> {
    const { uid, ...data } = task;
    await this.q().update(data).where({ uid });
  }

  public async delete(task: TaskDTO): Promise<void> {
    await this.q().delete().where({ uid: task.uid });
  }

  public async setPrice(task: string, price: number): Promise<void> {
    await this.q().insert({ task, price });
  }

  protected q<Rec extends object, Res = Rec[]>(): Knex.QueryBuilder<Rec, Res> {
    return this._knex('task').withSchema(this.schemaName) as Knex.QueryBuilder<
      Rec,
      Res
    >;
  }
}
