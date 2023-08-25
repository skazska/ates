import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';
import { TaskDTO } from '../types/task';
import { classToPlain } from '@nestjs/class-transformer';

@Injectable()
export class TaskDbService {
  private _knex: Knex;

  private schemaName = 'accounting';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async create(task: TaskDTO): Promise<void> {
    const rec = classToPlain(task);
    rec.description = `${task.description}${
      task.jiraId ? ` - [${task.jiraId}]` : ''
    }`;

    await this.q()
      .insert(task)
      .onConflict('uid')
      .merge(['assignee', 'description', 'status', 'title']);
  }

  public async update(task: TaskDTO): Promise<void> {
    const { uid, ...data } = task;
    await this.q().update(data).where({ uid });
  }

  public async delete(task: TaskDTO): Promise<void> {
    await this.q().delete().where({ uid: task.uid });
  }

  public async setPrice(
    uid: string,
    fee: number,
    reward: number,
  ): Promise<void> {
    await this.q()
      .insert({ uid, fee, reward })
      .onConflict('uid')
      .merge(['fee', 'reward']);
  }

  public async getPrice(
    uid: string,
  ): Promise<{ fee: number; reward: number } | undefined> {
    const [price] = await this.q<{ fee: number; reward: number }>()
      .select('fee', 'reward')
      .where('uid', uid);

    return price;
  }

  protected q<Rec extends object, Res = Rec[]>(): Knex.QueryBuilder<Rec, Res> {
    return this._knex('task').withSchema(this.schemaName) as Knex.QueryBuilder<
      Rec,
      Res
    >;
  }
}
