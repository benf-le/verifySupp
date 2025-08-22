import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDTO} from "./dto/user.dto";


@Controller('users')

export class UserController{
    constructor(private userService: UserService) {
    }

    @Get('/')
    async getUser(userDTO: UserDTO){
        // const userTypee = type === 'user' ? UserType.USER : UserType.ADMIN
        return await this.userService.getUser( userDTO)
    }

    @Get('/:id')
    async getUserById(@Param('id')id: string){
      return await this.userService.getUserById(id)
    }




    @Patch("/update/:id")
    updateUser(@Body() userDTO: UserDTO, @Param('id')id: string){
      // const adminId = this.productsService.getAdminByProductId()
      return this.userService.updateUser(userDTO, id)
    }




    @Delete("/delete/:id")
    deleteProduct( @Param('id')id: string){
      return this.userService.deleteProducts( id)
    }
}