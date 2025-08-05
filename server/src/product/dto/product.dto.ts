import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDTO {
  @IsString()
  name : string;

  @IsString()
  @IsOptional()
  decription? :string

  @IsNumber()
  price: number;

  @IsString()
  imageUrl :string

  @IsNumber()
  stockQuantity : number

  @IsString()
  usageIntruction :string

  @IsString()
  ingredients :string

  @IsBoolean()
  isActive :boolean = true;
}