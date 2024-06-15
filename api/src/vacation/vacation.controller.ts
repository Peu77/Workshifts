import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AuthGuard, UserParam} from "../user/guards/authGuard";
import {VacationDto} from "./dtos/vacationDto";
import {VacationService} from "./vacation.service";
import {UserEntity} from "../user/entities/user.entity";

@UseInterceptors(ClassSerializerInterceptor)
@Controller('vacation')
@UseGuards(AuthGuard)
export class VacationController {
    constructor(
        private readonly vacationService: VacationService
    ) {
    }

    @Post()
    async createVacation(@UserParam() user: UserEntity, @Body() {description, startDate, endDate}: VacationDto) {
        return this.vacationService.createVacation(user.id, description, startDate, endDate);
    }

    @Get()
    async getVacations(@UserParam() user: UserEntity) {
        return this.vacationService.getVacations(user.id);
    }

    @Delete(':id')
    async deleteVacation(@Param('id') id: number) {
        return this.vacationService.deleteVacation(id);
    }

    @Get('day/:day')
    async getVacationsOnDay(@Param('day') day: string) {
        return this.vacationService.getVacationsOnDay(new Date(day));
    }
}
