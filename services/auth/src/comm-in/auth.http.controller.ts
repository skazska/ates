import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { LoginService } from '../login/login.service';
import { HttpExceptionFilter } from './exception.filter';
import { SignInDTO } from '../types/sign';

/**
 * HttpController contains the HTTP endpoints for this service.
 * - check the health of the service
 */
@Controller('sign')
@UseFilters(new HttpExceptionFilter())
export class AuthHttpController {
  constructor(private login: LoginService) {}

  @Post('in')
  public async sinfIn(@Body() signIn: SignInDTO): Promise<{ token: string }> {
    return {
      token: await this.login.getToken(signIn),
    };
  }
}
