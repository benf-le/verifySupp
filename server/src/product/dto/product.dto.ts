import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDTO {
  @IsString()
  name : string;

  @IsString()
  @IsOptional()
  description? :string

  @IsNumber()
  price: number;

  @IsString()
  imageUrl :string

  @IsNumber()
  stockQuantity : number

  @IsString()
  usageInstruction :string

  @IsString()
  ingredients :string

  @IsBoolean()
  isActive :boolean = true;

  @IsInt()
  categoryId : number;
}