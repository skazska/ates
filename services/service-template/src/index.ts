import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './app-config/app-config.service';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

export async function bootstrap(): Promise<void> {
  console.log('bootstrap service-template');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get<AppConfigService>(AppConfigService);

  app.connectMicroservice({
    options: {
      client: {
        brokers: config.kafkaBrokers,
        clientId: config.serviceName,
        retry: {
          initialRetryTime: 500,
          maxRetryTime: 5000,
          retries: Number.POSITIVE_INFINITY,
        },
      },
      // consumer: { groupId },
      parser: { keepBinary: true },
      subscribe: { fromBeginning: true },
    },
    transport: Transport.KAFKA,
  });

  await app.init();

  await app.listen(8080, '0.0.0.0', (err, address) => {
    if (err) console.error(err);

    console.log('Microservice is listening', address);
  });
}

bootstrap().catch((err) => {
  console.error(err);

  process.exit(1);
});