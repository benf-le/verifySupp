// Define a "type" of "authentication request"
import {IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class ProductsDTO {
    @IsEmail() // dung de validate
    @IsNotEmpty() // dung de validate
    name: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    description: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    imageUrl: string

    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    price: bigint


    @IsString() // dung de validate
    forSale: string
}
