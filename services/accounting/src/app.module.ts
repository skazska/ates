import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { DbModule } from './db/db.module';
import { CommInModule } from './comm-in/comm-in.module';
import { CommOutModule } from './comm-out/comm-out.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [AppConfigModule, DbModule, CommInModule, CommOutModule, AccountModule],
})
export class AppModule {}
