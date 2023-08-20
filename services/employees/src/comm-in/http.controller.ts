import { Controller, Get } from '@nestjs/common';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - check the health of the service
 */
@Controller('check')
export class HttpController {
  @Get('health')
  public health(): string {
    return 'OK';
  }
}
