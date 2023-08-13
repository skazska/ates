import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as assert from 'assert';

interface EnvConfig {
  dbUrl: string;
  kafkaBrokers: string[];
}

@Injectable()
export class AppConfigService {
  private config: EnvConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      dbUrl: this.configService.get<string>('DB_URL', ''),
      kafkaBrokers: this.configService.get<string[]>('KAFKA_BROKERS', []),
    };

    assert(this.config.dbUrl, 'DB_URL is not set');
    assert(this.config.kafkaBrokers.length > 0, 'KAFKA_BROKERS is not set');
  }

  public get dbUrl(): string {
    return this.config.dbUrl;
  }

  public get kafkaBrokers(): string[] {
    return this.config.kafkaBrokers;
  }

  public get serviceName(): string {
    return 'tasks';
  }
}
