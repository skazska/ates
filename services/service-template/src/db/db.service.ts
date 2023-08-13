import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';

@Injectable()
export class DbService {
  private _knex: Knex;

  private schemaName = 'service-template';

  protected get q(): Knex.QueryBuilder {
    return this._knex.withSchema(this.schemaName);
  }

  constructor(private config: AppConfigService) {
    this._knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }

  public async init(): Promise<void> {
    const schema = this._knex.schema;
    await schema.dropSchemaIfExists(this.schemaName, true);
    await schema.createSchemaIfNotExists(this.schemaName);

    const hasTable = await schema.hasTable('service-template');

    if (hasTable) return;

    await schema.createTable('service-template', (qb) => {
      qb.increments('id');
      qb.string('name');
    });
  }
}
