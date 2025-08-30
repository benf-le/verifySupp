import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';

import {CollectionsService} from "./collections.service";
import {CollectionsDTO} from "./dto";
import { ProductDTO } from '../products/dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserType } from '@prisma/client';
import { AuthorizationGuard } from '../auth/guard/authorization.guard';


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


    @Roles(UserType.ADMIN)
    @UseGuards(AuthorizationGuard)
    @Post('/create')
    async createCollection(@Body() collectionDTO:CollectionsDTO){
      return await this.collectionsService.createCollection(collectionDTO)
    }


    @Roles(UserType.ADMIN)
    @UseGuards(AuthorizationGuard)
    @Delete('delete/:id')
    async deleteCollection(@Param('id') id: string){
      return await this.collectionsService.deteleCollection(id)
    }


    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}