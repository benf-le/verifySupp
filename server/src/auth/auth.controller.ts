import {Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {register} from "tsconfig-paths";
import { GenerateProductKeyDTO, LoginDTO, RegisterDTO} from "./dto";
import {UserType} from "@prisma/client";
import * as process from "process";
import * as bcrypt from "bcryptjs";


@Controller({})
export class AuthController {
    constructor(private authService: AuthService) {

    }
    // some request form client


    @Post("register/:userType")  // register a new user
     async registerAdmin(@Body() registerDTO:RegisterDTO, @Param('userType', new ParseEnumPipe(UserType)) userType:UserType) {

        if (userType!==UserType.USER){
            if (registerDTO.productKey){
                throw new UnauthorizedException()
            }
            const validProductKey = `${registerDTO.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

            const isValidProductKey= await bcrypt.compare(validProductKey, registerDTO.productKey)
            if (!isValidProductKey){
                throw new UnauthorizedException()
            }
        }

        return this.authService.register(registerDTO, userType)
    }

    @Post("login")
    login(@Body() loginDTO:LoginDTO){
        return this.authService.login(loginDTO)
    }
    @Post("/key")
    generateProductKey(@Body() {userType,email}:GenerateProductKeyDTO){
        return this.authService.generateProductKey(email, userType)
    }
}
