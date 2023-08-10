import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
//import { AuthGuard } from '@nestjs/passport';
import {Request} from 'express'
import { MyJwtGuard } from '../auth/guard';
import {GetUser} from "../auth/decorator";

@Controller('users')
@UseGuards(MyJwtGuard)
export class UserController {
    constructor(){}


    'path: users/me'
    @Get('me')
    me(@GetUser() user: User){
        return user
    }


}
