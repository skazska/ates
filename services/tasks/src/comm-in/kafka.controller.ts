import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EmployeeCudDTO } from '../types/employee';
import { EmployeeService } from '../employee/employee.service';
import { KafkaExceptionFilter } from './kafka.exception.filter';

@Controller()
@UseFilters(KafkaExceptionFilter)
export class KafkaController {
  public constructor(private employee: EmployeeService) {}

  /**
   * process new employee cud events
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @EventPattern('employees-cud', Transport.KAFKA)
  public async created(@Payload() payload: EmployeeCudDTO): Promise<void> {
    await this.employee.sync(payload);
  }
}
