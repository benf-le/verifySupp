// Define a "type" of "authentication request"
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class ProductDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  descriptionShort: string;

  @IsString()
  imageUrl: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  forSale: boolean;

  @IsString()
  type: string;

  @IsNumber()
  countInStock: number;

  @IsString()
  description: string;

  @IsString()
  ingredient: string;

  @IsString()
  @IsOptional()
  reviews: string;

  @IsString()
  collectionId: string;
}
