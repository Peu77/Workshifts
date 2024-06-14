import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {HolidayService} from "./holiday.service";
import {AuthGuard} from "../user/guards/authGuard";
import {AdminGuard} from "../user/guards/adminGuard";
import {HolidayDto} from "./dtos/holidayDto";

@UseGuards(AuthGuard, AdminGuard)
@Controller('holiday')
export class HolidayController {
    constructor(
        private readonly holidayService: HolidayService,
    ) {
    }

    @Post()
    async createHoliday(@Body() body: HolidayDto) {
        return this.holidayService.createHoliday(body);
    }

    @Get(":year")
    async getHolidays(@Param("year", ParseIntPipe) year: number) {
        return this.holidayService.getHolidays(year);
    }
}
