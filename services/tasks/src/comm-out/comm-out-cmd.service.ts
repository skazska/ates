import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from 'kafkajs';
import { TaskDTO } from '../types/task';
import { changedValidator } from '../types/get-json-checker';

@Injectable()
export class CommOutCmdService {
  protected topic = 'task-changed';

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

  public changed(task: TaskDTO, manager?: string): void {
    this.kafkaClient.emit(this.topic, this.getEventData(task, manager));
  }

  private getEventData(
    task: TaskDTO,
    manager?: string,
  ): Record<string, unknown> {
    const result = {
      uid: task.uid,
      title: task.title,
      description: task.description,
      status: task.status,
      assignee: task.assignee,
      manager,
    };

    if (!changedValidator(result)) {
      throw new Error(JSON.stringify(changedValidator.errors));
    }

    return result;
  }
}
