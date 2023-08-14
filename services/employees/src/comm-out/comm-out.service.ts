import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmployeeDTO } from '../types/employee';

@Injectable()
export class CommOutService {
  private cudTopic = 'employees-cud';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  public created(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'created',
      payload,
    });
  }

  public deleted(payload: string): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'deleted',
      payload,
    });
  }

  public updated(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'changed',
      payload,
    });
  }
}
