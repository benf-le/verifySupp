import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDTO } from './dto/category.dto';
import { ProductDTO } from '../product/dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(categoryDTO: CategoryDTO) {
    return this.prismaService.category.findMany();
  }

  async createCategory(categoryDTO: CategoryDTO, id: number) {
    try {
      const createCategory = await this.prismaService.category.create({
        data: {
          id,
          name: categoryDTO.name,
          description: categoryDTO.description,
        },
      });

      return createCategory;
    } catch (error) {
      throw new Error(`Could not create category: ${error.message}`);
    }
  }

  async updateCategory(categoryDTO: CategoryDTO, id: number) {
    try {
      const updateCategory = await this.prismaService.category.update({
        data: {
          name: categoryDTO.name,
          description: categoryDTO.description,
        },
        where: { id },
      });

      return updateCategory;
    } catch (error) {
      throw new Error(`Could not update category: ${error.message}`);

    }
  }

  async deleteCategory(id: number) {
   try {

     const deleteCategory = await this.prismaService.category.delete({
       where: { id },
     })

     return {
       message: 'Delete successful!',
       deletedCategory: deleteCategory,
     };
   }catch(error) {
     return (`Could not delete category: ${error.message}`);
   }
  }
}
