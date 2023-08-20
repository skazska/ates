import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Module({
  exports: [EmployeeService],
  providers: [EmployeeService],
})
export class EmployeeModule {}
