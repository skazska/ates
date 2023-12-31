import { Module } from '@nestjs/common';
import { AppConfigModule } from './app-config/app-config.module';
import { DbModule } from './db/db.module';
import { CommInModule } from './comm-in/comm-in.module';
import { CommOutModule } from './comm-out/comm-out.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    AppConfigModule,
    DbModule,
    CommInModule,
    CommOutModule,
    EmployeeModule,
    TaskModule,
  ],
})
export class AppModule {}
