import {AuthGuard} from '@nestjs/passport';
import any = jasmine.any;
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import {Reflector} from "@nestjs/core";

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()

        const requiredRoles = this.reflector.getAllAndOverride('roles', [context.getClass(), context.getHandler()])
        console.log('The required roles are', requiredRoles)

        const userRoles = request.user.role

        if(requiredRoles !== userRoles) return false


        console.log('INSIDE AUTHORIZATION GUARD')
        return true
    }


}