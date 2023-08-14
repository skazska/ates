import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class CommOutCmdService {
  private authTopic = 'employeeCreated';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  public created(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.authTopic, {
      action: 'created',
      payload,
    });
  }
}
