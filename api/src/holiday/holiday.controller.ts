import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {HolidayService} from "./holiday.service";
import {AuthGuard} from "../user/guards/authGuard";
import {AdminGuard} from "../user/guards/adminGuard";
import {HolidayDto} from "./dtos/holidayDto";
import {HolidayEntity} from "./entities/holiday.entity";

@UseGuards(AuthGuard)
@Controller('holiday')
export class HolidayController {
    constructor(
        private readonly holidayService: HolidayService,
    ) {
    }

    @UseGuards(AdminGuard)
    @Post()
    async createHoliday(@Body() body: HolidayDto) {
        return this.holidayService.createHoliday(body);
    }

    @UseGuards(AdminGuard)
    @Get(":year")
    async getHolidays(@Param("year", ParseIntPipe) year: number) {
        return this.holidayService.getHolidays(year);
    }

    @UseGuards(AdminGuard)
    @Delete(":id")
    async deleteHoliday(@Param("id", ParseIntPipe) id: number) {
        return this.holidayService.deleteHoliday(id);
    }

    @Get("day/:date")
    async isHoliday(@Param("date") date: string): Promise<HolidayEntity | null> {
        return this.holidayService.isHoliday(new Date(date));
    }
}
