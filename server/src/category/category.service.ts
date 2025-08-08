import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCategories(categoryDTO: CategoryDTO) {
    return this.prismaService.category.findMany()
  }
}