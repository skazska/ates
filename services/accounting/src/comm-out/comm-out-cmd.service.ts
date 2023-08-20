import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from 'kafkajs';

@Injectable()
export class CommOutCmdService {
  protected topic = 'accounting';

  public constructor(
    @Inject('KAFKA_CLIENT') protected kafkaClient: ClientKafka,
    @Inject('KAFKA_ADMIN') private admin: Admin,
  ) {}

  public async createTopics(): Promise<void> {
    const { admin, topic } = this;
    const toCreate = [topic];

    const existingTopics = await admin.listTopics();

    console.log('existing', existingTopics);

    const topics = toCreate.filter((t) => !existingTopics.includes(t));

    if (topics.length > 0) {
      const success = await admin.createTopics({
        topics: topics.map((t) => ({ topic: t })),
        waitForLeaders: true,
      });

      if (!success) {
        throw new Error('Failed to create topics');
      }

      console.log('Topics created', topics);
    }
  }
}
