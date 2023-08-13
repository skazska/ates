import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CommOutModule } from '../comm-out/comm-out.module';

@Module({
  exports: [EmployeeService],
  imports: [CommOutModule],
  providers: [EmployeeService],
})
export class EmployeeModule {}
