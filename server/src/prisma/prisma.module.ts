import {Global, Module} from '@nestjs/common';
import {PrismaService} from "./prisma.service";

@Global() // dung cho tat ca moi noi
@Module({
    providers: [PrismaService],
    exports: [PrismaService] //cac module khac co the dung module PrismaService
})
export class PrismaModule {
}

