import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { JwtModule } from '@nestjs/jwt';
import { BoardHttpController } from './board.http.controller';
import { AccountModule } from '../account/account.module';
import { EmployeeModule } from '../employee/employee.module';
import { TaskModule } from '../task/task.module';
import { CronHttpController } from './cron.http.controller';

@Module({
  imports: [
    AccountModule,
    EmployeeModule,
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    TaskModule,
  ],
  controllers: [
    BoardHttpController,
    CronHttpController,
    HttpController,
    KafkaController,
  ],
})
export class CommInModule {}
