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

    await this.dbService.init();
  }
}
