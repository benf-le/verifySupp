import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {register} from "tsconfig-paths";
import {AuthDTO} from "./dto";

@Controller({})
export class AuthController {
    constructor(private authService: AuthService) {

    }
    // some request form client
    @Post("register") // register a new user
     register(@Body() authDTO:AuthDTO){
        return this.authService.register(authDTO)
    }

    @Post("login")
    login(@Body() authDTO:AuthDTO){
        return this.authService.login(authDTO)
    }
}
