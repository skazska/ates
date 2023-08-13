import { Module } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { HttpController } from './http.controller';

@Module({
  controllers: [HttpController, KafkaController],
})
export class CommInModule {}
