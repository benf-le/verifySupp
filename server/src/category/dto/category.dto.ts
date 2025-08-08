import { IsOptional, IsString } from 'class-validator';

export class CategoryDTO{
  @IsString()
  name : string;

  @IsString()
  @IsOptional()
  description : string;

  @IsString()
  product : string;

  @IsString()
  @IsOptional()
  parent_category_id? : string;

}