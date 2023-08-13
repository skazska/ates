import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  exports: [AppConfigService],
  imports: [ConfigModule.forRoot()],
  providers: [AppConfigService],
})
export class AppConfigModule {}
