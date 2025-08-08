import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDTO } from './dto/category.dto';


@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {
  }

  @Get('/')
  async getCategories(categoryDTO: CategoryDTO) {
    return this.categoryService.getAllCategories(categoryDTO);
  }

  @Post('create-category')
  async createCategory(@Body() categoryDTO: CategoryDTO, @Body() user: any) {
    const id = user.id;
    return this.categoryService.createCategory(categoryDTO, id);
  }

  @Patch('update-category/:id')
  async updateCategory(@Body() categoryDTO: CategoryDTO,@Param('id') id: number) {
    return this.categoryService.updateCategory(categoryDTO, Number(id));
  }

  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoryService.deleteCategory(Number(id));
  }
}