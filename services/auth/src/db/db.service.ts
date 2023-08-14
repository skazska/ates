import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'auth';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async init(): Promise<void> {
    let schema = this._knex.schema;
    await schema.dropSchemaIfExists(this.schemaName, true);
    await schema.createSchemaIfNotExists(this.schemaName);

    console.log('schema', this.schemaName);

    schema = schema.withSchema(this.schemaName);
    await schema.dropTableIfExists('auth');

    await schema.createTable('auth', (qb) => {
      qb.increments('id');
      qb.string('name');
    });

    console.log('table created', this.schemaName);
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
