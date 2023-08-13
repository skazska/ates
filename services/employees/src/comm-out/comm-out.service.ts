import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class CommOutService {
  private employeesCudTopic = 'employees-cud';

  public constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {
    console.log('CommOutService.constructor()');
  }

  public created(payload: EmployeeDTO): void {
    console.log(`CommOutService.cud(${JSON.stringify(payload)})`);

    this.kafkaClient.emit(this.employeesCudTopic, {
      action: 'created',
      payload,
    });
  }

  public changed(payload: EmployeeDTO): void {
    console.log(`CommOutService.cud(${JSON.stringify(payload)})`);

    this.kafkaClient.emit(this.employeesCudTopic, {
      action: 'changed',
      payload,
    });
  }
}
