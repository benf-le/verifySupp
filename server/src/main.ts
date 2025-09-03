import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://verifysupp.lecambang.id.vn', // Thay bằng domain frontend của bạn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // add middleware HERE!
  app.useGlobalPipes(new ValidationPipe()); //request gửi đến controller thì đi qua ValidationPipe
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
