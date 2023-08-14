import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CommOutCmdService {
  private authTopic = 'auth-cmd';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
  ) {}
}
