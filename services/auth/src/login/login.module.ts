import { Module } from '@nestjs/common';
import { LoginService } from './login.service';

@Module({
  exports: [LoginService],
  providers: [LoginService],
})
export class LoginModule {}
