// src/user/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsBoolean, IsEnum, IsString } from 'class-validator';
import { UserType } from '@prisma/client';
import { UserDTO } from './user.dto';

export class UpdateUserDTO extends PartialType(UserDTO) {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(UserType)
  @IsOptional()
  user_type?: UserType;
}
