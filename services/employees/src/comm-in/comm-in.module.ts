import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { EmployeesHttpController } from './employees.http.controller';

@Module({
  controllers: [EmployeesHttpController, HttpController, KafkaController],
})
export class CommInModule {}
