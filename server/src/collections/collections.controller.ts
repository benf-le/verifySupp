import { Body, Controller, Get, Param, Post,Delete } from '@nestjs/common';

import {CollectionsService} from "./collections.service";
import {CollectionsDTO} from "./dto";
import { ProductDTO } from '../products/dto';


@Controller('collections')

export class CollectionsController {

    constructor(private collectionsService: CollectionsService) {

    }
    @Get(`/`)
    async getProducts(collectionsDTO:CollectionsDTO){
        return await this.collectionsService.getCollections(collectionsDTO)
    }


    @Get(`:id`) // register a new user
    async getCollectionsById(@Param('id')id: string){
        return await this.collectionsService.getCollectionsById(id)
    }

    @Post('/create')
    async createCollection(@Body() collectionDTO:CollectionsDTO){
      return await this.collectionsService.createCollection(collectionDTO)
    }

    @Delete('delete/:id')
    async deleteCollection(@Param('id') id: string){
      return await this.collectionsService.deteleCollection(id)
    }


    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}