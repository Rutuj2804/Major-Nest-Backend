import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from "@nestjs/common"
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(join(__dirname, '..'));
  await app.listen(5002);
}
bootstrap();
