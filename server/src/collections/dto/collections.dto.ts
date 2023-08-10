// Define a "type" of "authentication request"
import { IsNotEmpty, IsString} from 'class-validator'

export class CollectionsDTO {
    @IsString() // dung de validate
    @IsNotEmpty() // dung de validate
    name: string

}
