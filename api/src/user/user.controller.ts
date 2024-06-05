import {Body, Controller, Post, UnauthorizedException} from '@nestjs/common';
import {UserService} from "./user.service";
import {LoginDto} from "./dtos/loginDto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post("login")
    async login(@Body() body: LoginDto): Promise<{
        token: string
    }> {
        const check = await this.userService.checkEmailAndPassword(body.email, body.password);
        if (!check) {
            throw new UnauthorizedException("Invalid email or password")
        }

        const user = await this.userService.getUserByEmail(body.email);
        return {
            token: await this.userService.createJwtToken(user)
        };
    }
}
