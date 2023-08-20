import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error) {
    console.log('exception', exception);

    if (exception instanceof HttpException) {
      throw exception;
    }

    this.errorResponse(exception);
  }

  private errorResponse(error: Error) {
    if (error.message === 'Validation failed') {
      throw new HttpException(error.message, 400);
    }

    throw new HttpException(error.message, 500);
  }
}
