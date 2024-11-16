import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// TODO: Add config service
// TODO: Use the port from the environment variables
// TODO: Add logging

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
