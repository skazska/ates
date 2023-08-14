import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LoginDTO } from '../types/login';
import { Admin } from 'kafkajs';

@Injectable()
export class CommOutService {
  private cudTopic = 'logins-cud';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
    @Inject('KAFKA_ADMIN') private admin: Admin,
  ) {}

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

  public async createTopics(): Promise<void> {
    const { admin, cudTopic } = this;
    const toCreate = [cudTopic];

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
