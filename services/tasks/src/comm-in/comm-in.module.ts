import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [HttpController, KafkaController],
  imports: [JwtModule.register({ secret: 'hard!to-guess_secret' })],
})
export class CommInModule {}
