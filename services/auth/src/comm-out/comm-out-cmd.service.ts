import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CommOutCmdService {
  public constructor(
    @Inject('KAFKA_CLIENT') protected kafkaClient: ClientKafka,
  ) {}
}
