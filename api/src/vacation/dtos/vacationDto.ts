import {IsDate, IsDateString, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class VacationDto {

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    startDate: number

    @IsNumber()
    endDate: number
}