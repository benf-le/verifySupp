import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {Role} from "@prisma/client";

export class UserDTO{
  @IsString()
  name : string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsOptional()
  phone: number;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsEnum(Role)
  role: Role;

}