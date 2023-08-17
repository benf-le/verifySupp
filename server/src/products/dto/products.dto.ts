// Define a "type" of "authentication request"
import {IsEnum, IsNotEmpty, IsString} from 'class-validator'
import {UserType} from "@prisma/client";

export class ProductDTO {


    @IsString() name: string

    @IsString() descriptionShort: string

    @IsString() imageUrl: string

    @IsString() price: string


     forSale: boolean

    @IsString() type: string
    @IsString() countInStock: string
    @IsString() description: string
    @IsString() ingredient: string
    @IsString() reviews: string


}
