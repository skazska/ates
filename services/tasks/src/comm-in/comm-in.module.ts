import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from '../employee/employee.module';
import { TaskModule } from '../task/task.module';
import { BoardHttpController } from './board.http.controller';

@Module({
  controllers: [BoardHttpController, HttpController, KafkaController],
  imports: [
    EmployeeModule,
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
    TaskModule,
  ],
})
export class CommInModule {}
