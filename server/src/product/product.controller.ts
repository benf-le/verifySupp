import { Controller, Get, Delete, Param, Patch, Post, Put, Body, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './dto';

@Controller('product')

export class ProductController {
  constructor(private readonly productService: ProductService){

  }

  // @ts-ignore
  @Get(`/`)
  async getProduct( productDTO: ProductDTO){
    return await this.productService.getProduct(productDTO)

  }

  @Get(`:id`)
  async getProductById(@Param('id') id:number){
    return await this.productService.getProductById(Number(id))
  }

  @Post(`/create-product`)
  async createProduct(@Body() productDTO: ProductDTO,@Body() user:any){
    const id = user.id;

    // console.log(id);
    return this.productService.createProduct(productDTO, id);
  }

  @Patch(`update-product/:id`)
  async updateProduct(@Body() productDTO: ProductDTO,@Param('id') id:number){
    return this.productService.updateProduct(productDTO, Number(id))
  }

  @Delete(`delete-product/:id`)
  async deleteProduct(@Param('id') id:number){
    return this.productService.deleteProduct(Number(id))
  }

}