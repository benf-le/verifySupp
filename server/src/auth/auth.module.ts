import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from './strategy'

@Module({
    // imports:[ JwtModule.register({})],
    imports:[],
    controllers:[AuthController],
    providers:[AuthService]
    // providers:[AuthService, JwtStrategy]
})
export class AuthModule {}
