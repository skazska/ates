import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EmployeeDTO } from '../types/employee';
import { Admin } from 'kafkajs';
import { classToPlain } from '@nestjs/class-transformer';

@Injectable()
export class CommOutService {
  private cudTopic = 'employees-cud';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
    @Inject('KAFKA_ADMIN') private admin: Admin,
  ) {}

  public created(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'created',
      payload: this.getEventData(payload),
    });
  }

  public deleted(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'deleted',
      payload: this.getEventData(payload),
    });
  }

  public updated(payload: EmployeeDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'changed',
      payload: this.getEventData(payload),
    });
  }

  public async createTopics(): Promise<void> {
    const { admin, cudTopic } = this;
    const toCreate = [cudTopic];

    const existingTopics = await admin.listTopics();

    console.log('existing', existingTopics);

    const topics = toCreate.filter((t) => !existingTopics.includes(t));

    if (topics.length > 0) {
      await admin.createTopics({
        topics: topics.map((t) => ({ topic: t })),
        waitForLeaders: true,
      });

      console.log('Topics created', topics);
    }
  }

  private getEventData(payload: EmployeeDTO): Record<string, unknown> {
    return classToPlain(payload);
  }
}
