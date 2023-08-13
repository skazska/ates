import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { AppConfigModule } from '../app-config/app-config.module';

@Module({
  imports: [AppConfigModule, DbModule],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private dbService: DbService) {}

  async onApplicationBootstrap(): Promise<void> {
    console.log('AppModule.onApplicationBootstrap()');

    const schema = this.dbService.knex.schema;

    const hasTable = await schema.hasTable('service-template');

    if (hasTable) return;

    await schema.createTable('service-template', (qb) => {
      qb.increments('id');
      qb.string('name');
    });
  }
}
