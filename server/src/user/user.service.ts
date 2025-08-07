import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserDTO} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUsers(userDTO: UserDTO){
    return this.prismaService.user.findMany()
  }
}