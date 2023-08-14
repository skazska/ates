import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as assert from 'assert';

interface EnvConfig {
  dbUrl: string;
  kafkaBrokers: string[];
  kafkaRetry: {
    initialRetryTime: number;
    maxRetryTime: number;
    retries: number;
  };
  serviceName: string;
}

@Injectable()
export class AppConfigService {
  private config: EnvConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      dbUrl: this.configService.get<string>('DB_URL', ''),
      kafkaBrokers: this.configService
        .get<string>('KAFKA_BROKERS', '')
        .split(';'),
      kafkaRetry: {
        initialRetryTime: 500,
        maxRetryTime: 5000,
        retries: 100,
      },
      serviceName: 'auth',
    };

    assert(this.config.dbUrl, 'DB_URL is not set');
    assert(this.config.kafkaBrokers.length > 0, 'KAFKA_BROKERS is not set');
  }

  public get dbUrl(): EnvConfig['dbUrl'] {
    return this.config.dbUrl;
  }

  public get kafkaBrokers(): EnvConfig['kafkaBrokers'] {
    return this.config.kafkaBrokers;
  }

  public get kafkaRetry(): EnvConfig['kafkaRetry'] {
    return this.config.kafkaRetry;
  }

  public get serviceName(): EnvConfig['serviceName'] {
    return this.config.serviceName;
  }
}
