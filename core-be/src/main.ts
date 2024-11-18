import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// TODO: Add logging

async function bootstrap() {
  // - Create the app
  const app = await NestFactory.create(AppModule);
  
  // - Validation (and any other global) pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true } )); 

  // - Add ConfigService (dynamically set run-config specific parameters from .env file)
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('NESTJS_CORE_PORT'));
  // console.log('Listening on port: ', configService.getOrThrow('NESTJS_CORE_PORT'));
}
bootstrap();
