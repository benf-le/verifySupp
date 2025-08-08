import { Module } from '@nestjs/common';


import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule,PrismaModule,CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
