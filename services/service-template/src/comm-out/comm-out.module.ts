import { Module } from '@nestjs/common';
import { CommOutService } from './comm-out.service';

@Module({
  providers: [CommOutService],
})
export class CommOutModule {}
