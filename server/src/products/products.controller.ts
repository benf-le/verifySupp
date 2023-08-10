import { Controller, Get, Param} from "@nestjs/common";
import {ProductsDTO} from "./dto";
import {ProductsService} from "./products.service";


@Controller('products')

export class ProductsController{

    constructor(private productsService: ProductsService) {

    }
    @Get(`/`)
    async getProducts(productsDTO:ProductsDTO){
        return await this.productsService.getProducts(productsDTO)
    }

    @Get("/sale")
    async getProductsSale(productsDTO:ProductsDTO){
        return await this.productsService.getProductsSale(productsDTO)
    }

    @Get(`:id`) // register a new user
    async getProductsById(@Param('id')id: string){
        return await this.productsService.getProductsById(id)
    }

    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}