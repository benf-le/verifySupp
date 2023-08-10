import { Module } from '@nestjs/common';
import {PrismaModule} from "../prisma/prisma.module";
import {CollectionsController} from "./collections.controller";
import {CollectionsService} from "./collections.service";

@Module({
    imports:[PrismaModule],
    controllers:[CollectionsController],
    providers:[CollectionsService]
})
export class CollectionsModule {}
