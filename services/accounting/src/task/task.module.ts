import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  exports: [TaskService],
  providers: [TaskService],
})
export class TaskModule {}
