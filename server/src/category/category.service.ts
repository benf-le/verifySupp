import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDTO } from './dto/category.dto';
import { ProductDTO } from '../product/dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(categoryDTO: CategoryDTO) {
    return this.prismaService.category.findMany()
  }

  async createCategory(categoryDTO: CategoryDTO) {
    try {
      const createCategory = await this.prismaService.category.create({
        data:{
          name: categoryDTO.name,
          description: categoryDTO.description,

        }

      })

      return createCategory
    }catch (error) {
      throw new Error(`Could not create category: ${error.message}`);
    }
  }
}