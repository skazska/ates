import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CommOutService {
  public constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) {
    console.log('CommOutService.constructor()');
  }

  public cud(event: string, payload: Record<string, unknown>): void {
    console.log(`CommOutService.cud(${event}, ${JSON.stringify(payload)})`);

    this.kafkaClient.emit(event, payload);
  }
}
