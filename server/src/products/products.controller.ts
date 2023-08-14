import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import { ProductDTO } from './dto';
import { ProductsService } from './products.service';
import { Roles} from "../auth/decorator/roles.decorator";
import {MyJwtGuard} from "../auth/guard";
import {AuthorizationGuard} from "../auth/guard/authorization.guard";
import {User} from "../auth/decorator";


@Controller('products')
@UseGuards()
export class ProductsController{

    constructor(private readonly productsService: ProductsService) {

    }
    @Get(`/`)
    async getProducts(productsDTO:ProductDTO){
        return await this.productsService.getProducts(productsDTO)
    }

    @Get("/sale")
    async getProductsSale(productsDTO:ProductDTO){
        return await this.productsService.getProductsSale(productsDTO)
    }

    @Get(`:id`) // register a new user
    async getProductsById(@Param('id')id: string){
        return await this.productsService.getProductsById(id)
    }

    // @Post("/create-product")
    // async creatProducts(productsDTO:ProductDTO){
    //     return this.productsService.creatProducts(productsDTO)
    // }
    @Post("/create-product")
    createProduct(@Body() productDTO:ProductDTO, @User() user){
       console.log(user)
        return 'hi'
        // return this.productsService.creatProducts(productDTO)
    }

    // @Put("/update-product/:id")
    // updateProduct(@Body() productDTO:ProductDTO, @Param('id')id: string){
    //     return this.productsService.updateProducts(productDTO, id)
    // }
    //
    // @Delete("/delete-product/:id")
    // deleteProduct( @Param('id')id: string){
    //     return this.productsService.deleteProducts( id)
    // }

    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}