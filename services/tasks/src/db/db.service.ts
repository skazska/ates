import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'tasks';

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async init(): Promise<void> {
    let schema = this._knex.schema;
    await schema.dropSchemaIfExists(this.schemaName, true);
    await schema.createSchemaIfNotExists(this.schemaName);

    console.log('schema', this.schemaName);

    schema = schema.withSchema(this.schemaName);
    await schema.dropTableIfExists('tasks');

    await schema.createTable('tasks', (qb) => {
      qb.increments('id');
      qb.string('name');
    });

    console.log('table created', this.schemaName);
  }

  protected q(table?: string): Knex.QueryBuilder {
    return this._knex(table).withSchema(this.schemaName);
  }
}
