import { Global, Module } from '@nestjs/common';
import { CommOutService } from './comm-out.service';
import { AppConfigService } from '../app-config/app-config.service';
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

const kafkaProvider = {
  inject: [AppConfigService],
  provide: 'KAFKA_CLIENT',
  useFactory: async (configService: AppConfigService): Promise<ClientKafka> => {
    const client = ClientProxyFactory.create({
      options: {
        client: {
          clientId: configService.serviceName,
          brokers: configService.kafkaBrokers,
        },
        producer: {
          retry: configService.kafkaRetry,
        },
      },
      transport: Transport.KAFKA,
    });

    await client.connect();

    return client as ClientKafka;
  },
};

@Global()
@Module({
  exports: [CommOutService],
  providers: [CommOutService, kafkaProvider],
})
export class CommOutModule {}
