import {
  Controller,
  Get,
  Headers,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth-guard';
import { Roles } from './roles.decorator';
import { BoardService } from '../board/board.service';
import { Token } from '../../../../lib/types/jwt';
import { HttpExceptionFilter } from './exception.filter';

/**
 * HttpController contains the HTTP endpoints for this service.
 */
@Controller('board')
@UseFilters(new HttpExceptionFilter())
export class BoardHttpController {
  constructor(private board: BoardService) {}

  @Get('my-report')
  @Roles('admin', 'employee', 'manager')
  @UseGuards(AuthGuard)
  public async getMyReport(
    @Headers('x-token-data') tokenData: string,
  ): Promise<MyReportDTO[]> {
    const auth = JSON.parse(tokenData) as Token;
    return this.board.get(auth);
  }

  @Post('analytics')
  @Roles('admin', 'employee', 'manager')
  @UseGuards(AuthGuard)
  public async getAnalytics(): Promise<AnalyticsDTO> {
    const auth = JSON.parse(tokenData) as Token;
    return this.board.analytics(auth);
  }
}
