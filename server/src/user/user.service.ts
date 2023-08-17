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
}