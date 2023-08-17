import {Controller, Get, Param} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserDTO} from "./dto/user.dto";
import {UserType} from "@prisma/client";

@Controller('users')

export class UserController{
    constructor(private userService: UserService) {
    }

    @Get('/')
    async getUser(userDTO: UserDTO){
        // const userTypee = type === 'user' ? UserType.USER : UserType.ADMIN
        return await this.userService.getUser( userDTO)
    }
}