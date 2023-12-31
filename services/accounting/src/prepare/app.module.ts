import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { AppConfigModule } from '../app-config/app-config.module';
import { CommOutService } from '../comm-out/comm-out.service';
import { CommOutCmdService } from '../comm-out/comm-out-cmd.service';
import { CommOutModule } from '../comm-out/comm-out.module';

@Module({
  imports: [AppConfigModule, DbModule, CommOutModule],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private dbService: DbService,
    private commOut: CommOutService,
    private commOutCmd: CommOutCmdService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    console.log('AppModule.onApplicationBootstrap()');

    await this.dbService.init();

    await this.commOut.createTopics();

    await this.commOutCmd.createTopics();
  }
}
