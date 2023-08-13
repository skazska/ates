import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface EnvConfig {
  dbUrl: string;
  kafkaBrokers: string;
}

@Injectable()
export class AppConfigService {
  private config: EnvConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      dbUrl: this.configService.get<string>('DB_URL', ''),
      kafkaBrokers: this.configService.get<string>('KAFKA_BROKERS', ''),
    };
  }

  public get dbUrl(): string {
    return this.config.dbUrl;
  }

  public get kafkaBrokers(): string {
    return this.config.kafkaBrokers;
  }

  public get serviceName(): string {
    return 'service-template';
  }
}
