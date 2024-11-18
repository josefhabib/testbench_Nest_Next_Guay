import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// TODO: Add config service
// TODO: Use the port from the environment variables
// TODO: Add logging

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(    // Globally enable validation pipe
    {                                       // Optional configuration: Only allow properties that are defined in the DTO
      whitelist: true,  
    }
  )); 
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
