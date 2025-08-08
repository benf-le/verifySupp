import { IsInt, IsOptional, IsString } from 'class-validator';

export class CategoryDTO{
  @IsString()
  name : string;

  @IsString()
  @IsOptional()
  description? : string;

  @IsInt()
  @IsOptional()
  parent_category_id? : number;

}