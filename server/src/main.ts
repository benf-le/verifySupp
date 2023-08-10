import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // add middleware HERE!
  app.useGlobalPipes(new ValidationPipe()); //request gửi đến controller thì đi qua ValidationPipe
  await app.listen(7000);
}
bootstrap();
