import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { MyJwtGuard } from '../auth/guard';
// import {GetUser} from "../auth/decorator";
import {AuthorizationGuard} from "../auth/guard/authorization.guard";
import {Roles} from "../auth/decorator/roles.decorator";

@Controller('users')
@UseGuards(MyJwtGuard, AuthorizationGuard)
export class UserController {
    constructor(){}


    'path: users/me'
    // @Get('me')
    // me(@GetUser() user: User){
    //     return user
    // }



}
