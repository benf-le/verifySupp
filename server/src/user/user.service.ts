import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {UserDTO} from "./dto/user.dto";
import {UserType} from "@prisma/client";

@Injectable({})
export class UserService{
    constructor( private prismaService: PrismaService) {}

    async getUser(userDTO: UserDTO){


        const user = await this.prismaService.user.findMany();

        return user
    }

  async getUserById(id: string) {
    try {
      const userById = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      return userById;

    } catch (error) {

      return error;
    }
  }

  async updateUser(userDTO: UserDTO, id: string) {
    try {
      const updateUser = await this.prismaService.user.update({
        data: {
          firstName: userDTO.firstName,
          lastName: userDTO.lastName,
          isActive: userDTO.isActive,
          user_type: userDTO.user_type,
        },
        where: { id },
      });

      return updateUser;
    } catch (error) {
      throw new Error(`Could not create product: ${error.message}`);
    }
  }


  async deleteProducts(id: string) {
    try {
      const deleteUser = await this.prismaService.user.delete({
        where: { id },
      });

      if (deleteUser) {
        return 'Deleted Products';
      } else {
        return 'Error Delete Products';
      }
      ;
    } catch (error) {
      throw new Error(`Could not create product: ${error.message}`);
    }
  }
}