import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { validationPipe } from './config/validation.config';
import { getAppConfig } from './config/env.config';

async function bootstrap() {
  // app initialization
  const app = await NestFactory.create(AppModule);

  // hooking up environment variable
  const configService = app.get(ConfigService);

  // validation pipe
  app.useGlobalPipes(validationPipe);

  // listening on port
  await app.listen(getAppConfig(configService).port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
