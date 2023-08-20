import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { SyncEmployeeDbService } from './sync-employee.db.service';

@Global()
@Module({
  exports: [DbService, SyncEmployeeDbService],
  imports: [],
  providers: [DbService, SyncEmployeeDbService],
})
export class DbModule {}
