import { Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({
  exports: [DbService],
  imports: [],
  providers: [DbService],
})
export class DbModule {}
