import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
// import { EmployeeDTO } from '../types/employee';

@Injectable()
export class CommOutCmdService {
  // private topic = 'employee';

  public constructor(
    @Inject('KAFKA_CLIENT') protected kafkaClient: ClientKafka,
  ) {}

  // public created(payload: EmployeeDTO): void {
  //   this.kafkaClient.emit(this.topic, {
  //     action: 'created',
  //     payload,
  //   });
  // }
}
