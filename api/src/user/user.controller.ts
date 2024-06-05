import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    UnauthorizedException,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {LoginDto} from "./dtos/loginDto";
import {AuthGuard, UserParam} from "./guards/authGuard";
import {UserEntity} from "./entities/user.entity";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard)
    @Get("me")
    me(@UserParam() user: UserEntity) {
        return user
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
