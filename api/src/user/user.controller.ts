import {
    Body,
    ClassSerializerInterceptor,
    Controller, Delete,
    Get, Param, ParseIntPipe,
    Post, Put,
    UnauthorizedException,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {LoginDto} from "./dtos/loginDto";
import {AuthGuard, UserParam} from "./guards/authGuard";
import {UserEntity} from "./entities/user.entity";
import {AdminGuard} from "./guards/adminGuard";
import {UserDto} from "./dtos/userDto";
import {ChangePasswordDto} from "./dtos/changePasswordDto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @UseGuards(AuthGuard)
    @Get("me")
    me(@UserParam() user: UserEntity) {
        return user
    }

    @UseGuards(AuthGuard)
    @Put("change-password")
    async changePassword(@UserParam() user: UserEntity, @Body() body: ChangePasswordDto) {
        try {
            return await this.userService.changePassword(user, body.oldPassword, body.newPassword);
        } catch (e) {
            throw new UnauthorizedException(e.message);
        }
    }

    @Put(":id")
    @UseGuards(AuthGuard, AdminGuard)
    async update(@Param("id", ParseIntPipe) id: number, @Body() user: UserDto) {
        const userEntity = await this.userService.getUserById(id);
        if (!userEntity) {
            throw new UnauthorizedException("User not found");
        }

        return this.userService.applyDtoUser(userEntity, user);
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

    @Get("list")
    async list(): Promise<UserEntity[]> {
        return this.userService.getUserList();
    }

    @Delete(":id")
    @UseGuards(AuthGuard, AdminGuard)
    async delete(@Param("id", ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    @UseGuards(AuthGuard, AdminGuard)
    @Post("user")
    async create(@Body() user: UserDto) {
        const existingUser = await this.userService.getUserByEmail(user.email);
        if (existingUser) {
            throw new UnauthorizedException("User already exists")
        }

        return this.userService.applyDtoUser(new UserEntity(), user);
    }
}
