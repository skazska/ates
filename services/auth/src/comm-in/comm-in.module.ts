import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { LoginModule } from '../login/login.module';

@Module({
  imports: [LoginModule],
  controllers: [HttpController, KafkaController],
})
export class CommInModule {}
