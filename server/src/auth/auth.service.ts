import {ConflictException, HttpException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
// import {AuthDTO} from "./dto";
import {UserType} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken"
import * as process from "process";

interface SignUpParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface SignInParams {
    email: string;
    password: string;

}

@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        // private jwtService: JwtService,
        // private configService: ConfigService
    ) { //constructor:k hởi tạo PrismaService khi một đối tượng của lớp được tạo.

    }

    async register({email, password, firstName, lastName}: SignUpParams, userType: UserType) {
        const userExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (userExists) {
            throw new ConflictException()
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const user = await this.prismaService.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                user_type: userType,
            }
        })


        return this.generateJWT(user.email, user.id)


    }


    async login({email, password}: SignInParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            throw new HttpException("Invalid email", 400)
        }

        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashedPassword)

        if (!isValidPassword) {
            throw new HttpException("Invalid password", 400)

        }

        return this.generateJWT(user.email, user.id)





    }

    private generateJWT(email: string, id: string) {
        return jwt.sign({
                email,
                id
            },
            process.env.JSON_TOKEN_KEY, {
                expiresIn: 360000
            })

    }


    generateProductKey(email: string, userType: UserType) {
        const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

        return bcrypt.hash(string, 10)
    }

    // async register(authDTO: AuthDTO) {
    //     // ma hoa password
    //     const hashedPassword = await argon.hash(authDTO.password)
    //     // const hashedPassword = await bcrypt.hash(password,10)
    //
    //     try {
    //         // them data vao database
    //         const user = await this.prismaService.user.create({
    //             data: {
    //                 email: authDTO.email,
    //                 password: hashedPassword,
    //                 firstName: '',
    //                 lastName: '',
    //                 userType: UserType.USER,
    //             },
    //             // chỉ hiện ra các trường có true, khi trả data về
    //             select: {
    //                 id: true,
    //                 email: true,
    //                 userType:true,
    //                 createdAt: true
    //             }
    //         })
    //         return await this.signJwtString(user.id, user.email, user.userType)
    //     } catch (error) {
    //         if (error.code =='P2002'){
    //             throw new ForbiddenException('Email already registered!')
    //         }
    //         return error
    //     }
    //
    //
    // }
    //
    // async login(authDTO: AuthDTO) {
    //     //find user with input email
    //     const user = await this.prismaService.user.findUnique({
    //         where:{
    //             email:authDTO.email
    //         }
    //     })
    //     if(!user){
    //         throw new ForbiddenException('User not exist!')
    //     }
    //
    //     const passwordMatched = await argon.verify(
    //         user.password, //ĐÃ TEST. password trong trường hợp này là hashPassword. Không phải là lỗi, ide báo sai
    //         authDTO.password)
    //
    //     if(!passwordMatched){
    //         throw new ForbiddenException('Incorrect password!')
    //     }
    //
    //     delete  user.password //ĐÃ TEST. không phải là lỗi, ide báo sai. Xoá hashPassword đi để tránh lộ hashPassword khi trả data về client
    //     return await this.signJwtString(user.id, user.email, user.userType)
    // }


    // //now convert to a object, not  string
    // async signJwtString(userId: string, email: string, userType: string):Promise<{accessToken: string}> {
    //     const payload ={
    //         userId: userId,
    //         email: email,
    //         userType: userType
    //     }
    //
    //     const jwtString = await this.jwtService.signAsync(payload,
    //         {
    //             expiresIn: '24h',
    //             secret: this.configService.get('JWT_SECRET')
    //         })
    //     return {
    //         accessToken:jwtString
    //     }
    //
    // }
}

