import { Global, Module } from '@nestjs/common';
import { CommOutService } from './comm-out.service';
import { AppConfigService } from '../app-config/app-config.service';
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CommOutCmdService } from './comm-out-cmd.service';

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
  exports: [CommOutService, CommOutCmdService],
  providers: [CommOutService, CommOutCmdService, kafkaProvider],
})
export class CommOutModule {}
