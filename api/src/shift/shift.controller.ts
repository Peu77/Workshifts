import {BadRequestException, Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ShiftDto} from "./dtos/shiftDto";
import {ShiftService} from "./shift.service";
import {AuthGuard} from "../user/guards/authGuard";
import {AdminGuard} from "../user/guards/adminGuard";

@UseGuards(AuthGuard)
@Controller('shift')
export class ShiftController {
    constructor(
        private readonly shiftService: ShiftService
    ) {
    }


    @UseGuards(AdminGuard)
    @Post()
    async createShift(@Body() {name, startTime, endTime, minEmployees}: ShiftDto) {
        try {
            return this.shiftService.create(name, startTime, endTime, minEmployees);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @Get()
    async getShifts() {
        return this.shiftService.getShifts();
    }
}
