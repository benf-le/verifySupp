import {Injectable} from '@nestjs/common';
import {PrismaClient} from "@prisma/client";
import {ConfigService} from "@nestjs/config";

@Injectable({})
export class PrismaService extends PrismaClient{
    constructor(configService: ConfigService) {
        super({
            datasources:{
                db:{
                    // url:'mongodb+srv://benf_le:5DjyX8kWjKXph1bv@cluster0.lmkegwz.mongodb.net/pet_stock?retryWrites=true&w=majority'
                    url: configService.get('DATABASE_URL') //lấy ra link url từ file env
                }
            }
        });
    }

}

