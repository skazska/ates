import { Injectable } from '@nestjs/common';

@Injectable()
export class DeadLetterService {
  public register(
    topic: string,
    payload: unknown,
    ts: Date,
    exception: Error,
  ): void {
    console.error(exception);
    console.log('Dead letter', topic, payload, ts);
  }
}
