import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../app-config/app-config.service';
import knex, { Knex } from 'knex';

@Injectable()
export class DbService {
  public readonly knex: Knex;

  constructor(private config: AppConfigService) {
    this.knex = knex({ client: 'pg', connection: this.config.dbUrl });
  }
}
