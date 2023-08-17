import {IsEmail, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {UserType} from "@prisma/client";

export class UserDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    email: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    password: string

    @IsString()
    @IsNotEmpty() // dung de validate
    firstName: string
    @IsString()
    @IsNotEmpty() // dung de validate
    lastName: string

    @IsEnum(UserType)
    user_type: UserType



}