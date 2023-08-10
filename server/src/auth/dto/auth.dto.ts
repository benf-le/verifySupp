// Define a "type" of "authentication request"
import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class AuthDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    email: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    password: string
}
