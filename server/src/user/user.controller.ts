import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import {UserService} from "./user.service";
import {UserDTO} from "./dto/user.dto";
import { UpdateUserDTO } from './dto/update-user.dto';


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
    async updateUser(@Body() updateUserDTO: UpdateUserDTO, @Param('id')id: string){
      // const adminId = this.productsService.getAdminByProductId()
      return await this.userService.updateUser(updateUserDTO, id)
    }




    @Delete("/delete/:id")
    async deleteProduct( @Param('id')id: string){
      return await this.userService.deleteProducts( id)
    }
}