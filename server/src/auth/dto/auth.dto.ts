import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDTO{

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;


  @IsEnum(Role)
  role: Role;
}

export class LoginDTO {
  @IsEmail() // dung de validate
  @IsNotEmpty() // dung de validate
  email: string

  @IsString() // dung de validate
  @IsNotEmpty() // dung de validate
  password: string



}