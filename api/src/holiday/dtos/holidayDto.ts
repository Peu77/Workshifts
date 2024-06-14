import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class HolidayDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsDateString()
    date: string
}