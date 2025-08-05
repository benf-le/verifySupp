import {Global, Module} from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import { ConfigModule } from '@nestjs/config';

@Global() // dung cho tat ca moi noi
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService] //cac module khac co the dung module PrismaService
})
export class PrismaModule {
}
