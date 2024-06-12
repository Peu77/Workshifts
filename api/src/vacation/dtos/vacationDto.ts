import {IsDateString} from "class-validator";

export class VacationDto{


    @IsDateString()
    startDate: Date

    @IsDateString()
    endDate: Date
}