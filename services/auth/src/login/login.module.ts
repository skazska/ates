import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  exports: [LoginService],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
  providers: [LoginService],
})
export class LoginModule {}
