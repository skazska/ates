import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from 'kafkajs';
import { TaskDTO } from '../types/task';
import { classToPlain } from '@nestjs/class-transformer';
import { cudValidator, cudValidatorV2 } from '../types/get-json-checker';
import {CommOutService} from "./comm-out.service";

@Injectable()
export class CommOutServiceV2 {
  private cudTopic = 'accounting-cud-v2';

  public constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
    @Inject('KAFKA_ADMIN') private admin: Admin,
    private backward: CommOutService,
  ) {}

  public created(payload: TaskDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'created',
      payload: this.getEventData(payload),
    });

    this.backward.created(payload);
  }

  public deleted(payload: TaskDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'deleted',
      payload: this.getEventData(payload),
    });
    this.backward.deleted(payload);
  }

  public updated(payload: TaskDTO): void {
    this.kafkaClient.emit(this.cudTopic, {
      action: 'changed',
      payload: this.getEventData(payload),
    });
    this.backward.updated(payload);
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

  private getEventData(payload: TaskDTO): Record<string, unknown> {
    const result = classToPlain(payload);

    if (!cudValidatorV2(result)) {
      throw new Error(JSON.stringify(cudValidator.errors));
    }

    return result;
  }
}
