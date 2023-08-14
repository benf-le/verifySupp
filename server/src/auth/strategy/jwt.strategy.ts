import { PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(configService: ConfigService,
                public prismaService: PrismaService) {
        super({
            // dua jwt vao header cua request
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            //xac nhan jwt_secret
            secretOrKey: configService.get('JWT_SECRET')
        });
    }
    async validate(payload: {userId: string; email: string;}) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.userId,

            }
        })
        delete user.password
        return user;
    }

}