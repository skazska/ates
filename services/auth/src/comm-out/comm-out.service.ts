import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoginDTO } from '../types/login';

@Injectable()
export class CommOutService {
  private cudTopic = 'login-cud';

  public constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {
    console.log('CommOutService.constructor()');
  }

  public created(payload: LoginDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'created',
      payload,
    });
  }

  public deleted(payload: LoginDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'deleted',
      payload,
    });
  }

  public updated(payload: LoginDTO): void {
    console.log(`CommOutService.cud(${JSON.stringify(payload)})`);

    this.kafkaClient.emit(this.cudTopic, {
      action: 'changed',
      payload,
    });
  }
}
