import { NestFactory } from '@nestjs/core';
import { AppConfigService } from './app-config/app-config.service';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap(): Promise<void> {
  console.log('bootstrap tasks');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = app.get<AppConfigService>(AppConfigService);

  app.connectMicroservice({
    options: {
      client: {
        brokers: config.kafkaBrokers,
        clientId: config.serviceName,
        retry: config.kafkaRetry,
      },
      consumer: {
        groupId: config.serviceName,
      },
      subscribe: { fromBeginning: true },
    },
    transport: Transport.KAFKA,
  });

  await app.startAllMicroservices();
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
