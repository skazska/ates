import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoginDTO } from '../types/login';

@Injectable()
export class CommOutCmdService {
  private authTopic = 'auth-cmd';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  public createLogin(payload: LoginDTO): void {
    this.kafkaClient.emit(this.authTopic, {
      action: 'created',
      payload,
    });
  }
}
