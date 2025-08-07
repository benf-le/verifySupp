import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getUser(userDTO: UserDTO) {
    return await this.userService.getUsers(userDTO);
  }
}
