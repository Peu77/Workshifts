import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {ShiftTime} from "../entities/shift.entity";

export class ShiftDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    startTime: ShiftTime

    @IsNotEmpty()
    endTime: ShiftTime

    @IsNumber()
    minEmployees: number
}