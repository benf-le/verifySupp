import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/category.dto';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(categoryDTO: CategoryDTO) {
    return this.categoryService.getAllCategories(categoryDTO);
  }
}