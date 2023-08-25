import { Global, Module } from '@nestjs/common';
import { CommOutService } from './comm-out.service';
import { AppConfigService } from '../app-config/app-config.service';
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CommOutCmdService } from './comm-out-cmd.service';
import { Admin, Kafka } from 'kafkajs';
import { CommOutServiceV2 } from './comm-out.service_v2';

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

const kafkaAdminProvider = {
  inject: [AppConfigService],
  provide: 'KAFKA_ADMIN',
  useFactory: async (configService: AppConfigService): Promise<Admin> => {
    const kafka = new Kafka({
      brokers: configService.kafkaBrokers,
      retry: configService.kafkaRetry,
    });

    const admin = kafka.admin();

    await admin.connect();

    return admin;
  },
};

@Global()
@Module({
  exports: [CommOutService, CommOutCmdService, CommOutServiceV2],
  providers: [
    CommOutService,
    CommOutServiceV2,
    CommOutCmdService,
    kafkaProvider,
    kafkaAdminProvider,
  ],
})
export class CommOutModule {}
