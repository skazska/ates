import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { LoginModule } from '../login/login.module';
import { AuthHttpController } from './auth.http.controller';

@Module({
  imports: [LoginModule],
  controllers: [AuthHttpController, HttpController, KafkaController],
})
export class CommInModule {}
