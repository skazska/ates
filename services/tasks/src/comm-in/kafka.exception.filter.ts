import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { DeadLetterService } from './dead-letter.service';

@Catch(Error)
@Injectable()
export class KafkaExceptionFilter implements ExceptionFilter {
  constructor(private deadLetter: DeadLetterService) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    this.deadLetter.register('http', ctx.getData(), new Date(), exception);
  }
}
