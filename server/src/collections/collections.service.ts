import {ForbiddenException, Injectable, Param} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CollectionsDTO} from "./dto";


@Injectable({})
export class CollectionsService {
    constructor(private readonly prismaService: PrismaService) { //constructor: khởi tạo PrismaService khi một đối tượng của lớp được tạo.

    }

    async getCollections(collectionsDTO: CollectionsDTO) {
        try {
            const collections = await this.prismaService.collection.findMany({})
            return collections
        } catch (error) {

            return error
        }
    }

    async getCollectionsById(id: string) {
        try {
            const collectionsById = await this.prismaService.collection.findUnique({
                where:{
                    id
                }
            })
            return collectionsById
        } catch (error) {

            return error
        }
    }


}