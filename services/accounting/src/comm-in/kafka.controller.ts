import { Controller, UseFilters } from '@nestjs/common';
import { TaskService } from '../task/task.service';
import { EmployeeService } from '../employee/employee.service';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EmployeeCudDTO } from '../types/employee';
import { TaskChangedDTO, TaskCudDTO } from '../types/task';
import { AccountService } from '../account/account.service';
import { KafkaExceptionFilter } from './kafka.exception.filter';

@Controller()
@UseFilters(KafkaExceptionFilter)
export class KafkaController {
  public constructor(
    private employee: EmployeeService,
    private task: TaskService,
    private account: AccountService,
  ) {}

  /**
   * process employee cud events
   */
  @EventPattern('employees-cud', Transport.KAFKA)
  public async employeeSync(@Payload() payload: EmployeeCudDTO): Promise<void> {
    await this.employee.sync(payload);
  }

  /**
   * process task cud events
   */
  @EventPattern('tasks-cud-v2', Transport.KAFKA)
  public async taskSync(@Payload() payload: TaskCudDTO): Promise<void> {
    await this.task.sync(payload);
  }

  /**
   * process task changed bussiness event
   */
  @EventPattern('tasks-changed', Transport.KAFKA)
  public async taskProcess(@Payload() payload: TaskChangedDTO): Promise<void> {
    await this.account.processChange(payload);
  }
}
