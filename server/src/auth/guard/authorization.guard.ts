import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import * as jwt from "jsonwebtoken"
import {Reflector} from "@nestjs/core";
import * as process from "process";
import {PrismaService} from "../../prisma/prisma.service";

interface JWTPayload {
    email: string;
    id: string;
    createdAt: number;
    updatedAt: number;
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector, private prismaService: PrismaService) {
    }

    async canActivate(context: ExecutionContext) {

        const requiredRoles = this.reflector.getAllAndOverride('roles', [context.getClass(), context.getHandler()])
        console.log('The required roles are', requiredRoles)

        if (requiredRoles?.length) {
            //Grab the JWT from the request header and verify it
            const request = context.switchToHttp().getRequest()
            const token = request.headers?.authorization?.split('Bearer ')[1]
            try {
                const payload = await jwt.verify(token, process.env.JSON_TOKEN_KEY) as JWTPayload

                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: payload.id
                    }
                })

                if (!user) return false


                if (requiredRoles.includes(user.user_type)) return true
                return false
            } catch (e) {
                return false
            }


        }
        //
        // const userRoles = request.user.role
        //
        // if(requiredRoles !== userRoles) return false
        //
        //
        // console.log('INSIDE AUTHORIZATION GUARD')
        return true
    }


}