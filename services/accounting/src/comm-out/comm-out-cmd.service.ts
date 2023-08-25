import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Admin } from 'kafkajs';
import {
  balanceChangedValidator,
  dayFixedValidator,
  paidValidator,
  priceSetValidator,
} from '../types/get-json-checker';

@Injectable()
export class CommOutCmdService {
  protected topics = {
    dayFixed: 'day-fixed',
    balanceChanged: 'balance-changed',
    priceSet: 'price-set',
    paid: 'paid',
  };

  public constructor(
    @Inject('KAFKA_CLIENT') protected kafkaClient: ClientKafka,
    @Inject('KAFKA_ADMIN') private admin: Admin,
  ) {}

  public async createTopics(): Promise<void> {
    const { admin } = this;
    const toCreate = Object.values(this.topics);

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

  public dayFixed(): void {
    this.kafkaClient.emit(this.topics.dayFixed, this.getDayFixedEventData({}));
  }

  public balanceChanged(employee: string, balance: number): void {
    this.kafkaClient.emit(
      this.topics.balanceChanged,
      this.getBalanceChangedEventData({ employee, balance }),
    );
  }

  public priceSet(task: string, fee: number, reward: number): void {
    this.kafkaClient.emit(
      this.topics.priceSet,
      this.getPriceSetEventData({ task, fee, reward }),
    );
  }

  public paid(employee: string, amount: number): void {
    this.kafkaClient.emit(
      this.topics.paid,
      this.getPaidEventData({ employee, amount }),
    );
  }

  private getDayFixedEventData(data: object): Record<string, unknown> {
    if (!dayFixedValidator(data)) {
      throw new Error(JSON.stringify(dayFixedValidator.errors));
    }

    return data as Record<string, unknown>;
  }

  private getBalanceChangedEventData(data: {
    employee: string;
    balance: number;
  }): Record<string, unknown> {
    if (!balanceChangedValidator(data)) {
      throw new Error(JSON.stringify(balanceChangedValidator.errors));
    }

    return data;
  }

  private getPaidEventData(data: {
    employee: string;
    amount: number;
  }): Record<string, unknown> {
    if (!paidValidator(data)) {
      throw new Error(JSON.stringify(paidValidator.errors));
    }

    return data;
  }

  private getPriceSetEventData(data: {
    task: string;
    fee: number;
    reward: number;
  }): Record<string, unknown> {
    if (!priceSetValidator(data)) {
      throw new Error(JSON.stringify(priceSetValidator.errors));
    }

    return data;
  }
}
