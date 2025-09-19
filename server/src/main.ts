import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://verifysupp.lecambang.id.vn',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Ghi đè header X-Frame-Options
  app.use((req, res, next) => {
    res.removeHeader('X-Frame-Options');
    // hoặc nếu bạn chỉ muốn allow frontend domain:
    // res.setHeader('X-Frame-Options', 'ALLOW-FROM https://verifysupp.lecambang.id.vn');
    next();
  });

  // add middleware HERE!
  app.useGlobalPipes(new ValidationPipe()); //request gửi đến controller thì đi qua ValidationPipe
  await app.listen(process.env.PORT || 7000);
}
bootstrap();
