import {IsBoolean, IsEmail, IsHexColor, IsNotEmpty, IsString, MinLength} from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsHexColor()
    color: string

    @IsBoolean()
    isAdmin: boolean

    password: string | undefined
}