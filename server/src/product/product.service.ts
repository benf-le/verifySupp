import { PrismaService } from '../prisma/prisma.service';
import { ProductDTO } from './dto';
import { Injectable } from '@nestjs/common';


@Injectable({})
export class ProductService {
  constructor(private readonly prismaService: PrismaService) { //constructor: khởi tạo PrismaService khi một đối tượng của lớp được tạo.

  }

  async getProduct(productDTO: ProductDTO) {
    try {
      return await this.prismaService.product.findMany({});
    } catch (err) {
      return err;
    }
  }

  async getProductById(id: number) {
    try {
      return await this.prismaService.product.findUnique({
        where: { id },
      });
    } catch (err) {
      return err;
    }
  }

  async createProduct(productDTO: ProductDTO, id: number) {
    try {
      const createProduct = await this.prismaService.product.create({
        data: {
          id,
          name: productDTO.name,
          decription: productDTO.decription,
          price: productDTO.price,
          imageUrl: productDTO.imageUrl,
          stockQuantity: productDTO.stockQuantity,
          usageIntruction: productDTO.usageIntruction,
          ingredients: productDTO.ingredients,
          isActive: productDTO.isActive,
          categoryId: productDTO.categoryId,
        },
      });

      return createProduct;
    }
    catch (err) {
      throw new Error(`Could not create product: ${err.message}`);
    }
  }


  async updateProduct(productDTO: ProductDTO, id: number) {
    try {
      const updateProduct = await this.prismaService.product.update({
        data :{
          id,
          name: productDTO.name,
          decription: productDTO.decription,
          price: productDTO.price,
          imageUrl: productDTO.imageUrl,
          stockQuantity: productDTO.stockQuantity,
          usageIntruction: productDTO.usageIntruction,
          ingredients: productDTO.ingredients,
          isActive: productDTO.isActive,
        },
        where: { id },
      })

      return updateProduct;
    }
    catch (err) {
      throw new Error(`Could not update product: ${err.message}`);
    }
  }

  async deleteProduct(id: number) {
    return this.prismaService.product.delete({
      where: { id },
    })
  }
}