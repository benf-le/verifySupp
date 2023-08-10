import {ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDTO} from "./dto";
import * as argon from "argon2";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";


@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService:ConfigService
    ) { //constructor:k hởi tạo PrismaService khi một đối tượng của lớp được tạo.

    }

    async register(authDTO: AuthDTO) {
        // ma hoa password
        const hashedPassword = await argon.hash(authDTO.password)

        try {
            // them data vao database
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    password: hashedPassword,
                    firstName: '',
                    lastName: '',
                },
                // chỉ hiện ra các trường có true, khi trả data về
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })
            return await this.signJwtString(user.id, user.email)
        } catch (error) {
            if (error.code =='P2002'){
                throw new ForbiddenException('Email already registered!')
            }
            return error
        }


    }

    async login(authDTO: AuthDTO) {
        //find user with input email
        const user = await this.prismaService.user.findUnique({
            where:{
                email:authDTO.email
            }
        })
        if(!user){
            throw new ForbiddenException('User not exist!')
        }

        const passwordMatched = await argon.verify(
            user.password, //ĐÃ TEST. password trong trường hợp này là hashPassword. Không phải là lỗi, ide báo sai
            authDTO.password)

        if(!passwordMatched){
            throw new ForbiddenException('Incorrect password!')
        }

        delete  user.password //ĐÃ TEST. không phải là lỗi, ide báo sai. Xoá hashPassword đi để tránh lộ hashPassword khi trả data về client
        return await this.signJwtString(user.id, user.email)
    }


    //now convert to a object, not  string
    async signJwtString(userId: string, email: string):Promise<{accessToken: string}> {
        const payload ={
            userId: userId,
            email: email
        }

        const jwtString = await this.jwtService.signAsync(payload,
            {
                expiresIn: '24h',
                secret: this.configService.get('JWT_SECRET')
            })
        return {
            accessToken:jwtString
        }

    }
}

