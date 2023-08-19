import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('exception', exception);

    if (exception instanceof HttpException) {
      throw exception;
    }

    this.errorResponse(exception, host);
  }

  private errorResponse(error: Error, host: ArgumentsHost) {
    if (error.message === 'Validation failed') {
      throw new HttpException(error.message, 400);
    }

    const ctx = host.switchToHttp();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    ctx.getResponse().json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      path: ctx.getRequest().url,
    });
  }
}
