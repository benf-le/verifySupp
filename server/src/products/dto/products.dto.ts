// Define a "type" of "authentication request"
import {isBoolean, IsEmail, IsNotEmpty, IsString} from 'class-validator'

export class ProductDTO {
    @IsString()

    name: string

    @IsString() // dung de validate

    descriptionShort: string

    @IsString() // dung de validate

    imageUrl: string

    @IsString() // dung de validate

    price: string



    forSale: string
}
