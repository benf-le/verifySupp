import {ForbiddenException, Injectable, Param} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CollectionsDTO} from "./dto";


@Injectable({})
export class CollectionsService {
    constructor(private readonly prismaService: PrismaService) { //constructor: khởi tạo PrismaService khi một đối tượng của lớp được tạo.

    }

    async getCollections(collectionsDTO: CollectionsDTO) {
        try {
          const collections = await this.prismaService.collection.findMany({
            include: {
              _count: {
                select: { products: true } // ← Đếm số products trong collection
              }
            }
          });

          // Transform data để frontend dễ sử dụng
          return collections.map(collection => ({
            id: collection.id,
            name: collection.name,
            productsCount: collection._count?.products || 0 // ← Map từ _count.products
          }));
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

    async createCollection(collectionDTO: CollectionsDTO) {
      try{
        const createCollection = await this.prismaService.collection.create({
          data:{
            name: collectionDTO.name,
          }
        })

        return createCollection
      }catch(error){
        return error
      }
    }


}