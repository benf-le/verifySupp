import {ForbiddenException, Injectable, Param} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {ProductsDTO} from "./dto";


@Injectable({})
export class ProductsService {
    constructor(private prismaService: PrismaService) { //constructor: khởi tạo PrismaService khi một đối tượng của lớp được tạo.

    }

    async getProducts(productsDTO: ProductsDTO) {
        try {
            const products = await this.prismaService.products.findMany({})
            return products
        } catch (error) {

            return error
        }
    }

    async getProductsById(id: string) {
        try {
            const productsById = await this.prismaService.products.findUnique({
                where:{
                    id
                }
            })
            return productsById
        } catch (error) {

            return error
        }
    }

    async getProductsSale(productsDTO: ProductsDTO) {
        try {
            const products = await this.prismaService.products.findMany({
                where: {
                    forSale: true
                }
            })
            return products
        } catch (error) {

            return error
        }
    }
}