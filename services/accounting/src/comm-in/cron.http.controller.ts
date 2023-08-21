import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../account/account.service';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - check the health of the service
 */
@Controller('cron')
export class CronHttpController {
  constructor(private account: AccountService) {}

  @Get('day_completed')
  public closeDay(): void {
    this.account.closeDay().catch((e) => {
      console.error(e);
    });
  }
}
