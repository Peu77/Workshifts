import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class VacationDto {

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    startDate: Date

    @IsDateString()
    endDate: Date
}