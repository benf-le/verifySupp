import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from "@nestjs/common";
import { ProductDTO } from './dto';
import { ProductsService } from './products.service';
import { Roles} from "../auth/decorator/roles.decorator";
import {MyJwtGuard} from "../auth/guard";
import {AuthorizationGuard} from "../auth/guard/authorization.guard";
import {UserInfo, Users} from "../auth/decorator";
import {UserType} from "@prisma/client";


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
    @Roles(UserType.ADMIN)
    // @UseGuards(AuthorizationGuard)
    @Post("/create-product")
    createProduct(@Body() productDTO:ProductDTO, @Users() user: UserInfo){
        // return 'clcmm'

        return this.productsService.creatProducts(productDTO, user.id)
    }


    @Roles(UserType.ADMIN)
    // @UseGuards(AuthorizationGuard)
    @Put("/update-product/:id")
    updateProduct(@Body() productDTO:ProductDTO, @Param('id')id: string){
        // const adminId = this.productsService.getAdminByProductId()
        return this.productsService.updateProducts(productDTO, id)
    }


    @Roles(UserType.ADMIN)
    // @UseGuards(AuthorizationGuard)
    @Delete("/delete-product/:id")
    deleteProduct( @Param('id')id: string){
        return this.productsService.deleteProducts( id)
    }



    // @Get("showProductsSale:id") // register a new user
    // async getProductsSale(productsDTO:CollectionsDto){
    //     return await this.productsService.getProductsSale(productsDTO)
    // }

}
//USER
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxNEBnbWFpbC5jb20iLCJpZCI6IjY0ZGE4OTgyZDA5YTE2NGViZjRkYjA2MiIsImlhdCI6MTY5MjA0MzY1MCwiZXhwIjoxNjkyNDAzNjUwfQ.Cg-H5OTteIOGKe9oPOkQEotK1F6BYuiV7ufrJICLgtU

//ADMIN
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxMkBnbWFpbC5jb20iLCJpZCI6IjY0ZGE0YTYzODY0MWViZTM5NDlkMTRiYiIsImlhdCI6MTY5MjA0MjQ4OSwiZXhwIjoxNjkyNDAyNDg5fQ.8vPq_vMIdZrPsnwGy9vGat-X8agMe2GuzWpfNLXVJWc