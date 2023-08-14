import { Controller, Get } from '@nestjs/common';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - check the health of the service
 */
@Controller('check')
export class HttpController {
  // eslint-disable-next-line @typescript-eslint/require-await
  @Get('health')
  public async health(): Promise<string> {
    return 'OK';
  }
}
