import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { TaskModule } from '../task/task.module';

@Module({
  exports: [AccountService],
  imports: [TaskModule],
  providers: [AccountService],
})
export class AccountModule {}
