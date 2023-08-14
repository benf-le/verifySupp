// Define a "type" of "authentication request"
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator'
import {UserType} from "@prisma/client";

export class RegisterDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    email: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    password: string


    firstName: string

    lastName: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    productKey?: string



}
export class LoginDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    email: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    password: string



}
export class GenerateProductKeyDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    email: string


    @IsEnum(UserType)
    userType: UserType


}
