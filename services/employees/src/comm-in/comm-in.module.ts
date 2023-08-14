import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { EmployeesHttpController } from './employees.http.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  controllers: [EmployeesHttpController, HttpController, KafkaController],
  imports: [EmployeeModule],
})
export class CommInModule {}
