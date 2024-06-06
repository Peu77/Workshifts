import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class UserDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;
}