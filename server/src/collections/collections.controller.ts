import { Controller, Get, Param} from "@nestjs/common";

import {CollectionsService} from "./collections.service";
import {CollectionsDTO} from "./dto";


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

    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}