import { Module } from '@nestjs/common';


import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductModule,PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
