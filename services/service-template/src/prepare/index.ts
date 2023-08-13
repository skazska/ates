import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap(): Promise<void> {
  console.log('init service-template');

  const app = await NestFactory.createApplicationContext(AppModule, {});

  await app.close();
}

bootstrap()
  .then(() => {
    console.log('done init service-template');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);

    process.exit(1);
  });
