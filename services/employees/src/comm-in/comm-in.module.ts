import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { EmployeesHttpController } from './employees.http.controller';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  controllers: [EmployeesHttpController, KafkaController],
  imports: [EmployeeModule],
})
export class CommInModule {}
