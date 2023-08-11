// Define a "type" of "authentication request"
import { IsString} from 'class-validator'

export class ProductDTO {
    @IsString() name: string

    @IsString() descriptionShort: string

    @IsString() imageUrl: string

    @IsString() price: string


    @IsString() forSale: string

    @IsString() type: string
    @IsString() countInStock: string
    @IsString() description: string
    @IsString() ingredient: string
    @IsString() reviews: string
}
