import {
    BadRequestException,
    Body, ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import {ShiftDto} from "./dtos/shiftDto";
import {ShiftService} from "./shift.service";
import {AuthGuard, UserParam} from "../user/guards/authGuard";
import {AdminGuard} from "../user/guards/adminGuard";
import {ShiftDayEntity} from "./entities/shiftDay.entity";
import {UserEntity} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('shift')
export class ShiftController {
    constructor(
        private readonly shiftService: ShiftService,
        private readonly userService: UserService,
    ) {
    }


    @UseGuards(AdminGuard)
    @Post()
    async createShift(@Body() {name, startTime, endTime, minEmployees, wholeDay}: ShiftDto) {
        try {
            return this.shiftService.create(name, startTime, endTime, minEmployees, wholeDay);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @UseGuards(AdminGuard)
    @Delete(":id")
    async deleteShift(@Param("id", ParseIntPipe) id: number) {
        try {
            return this.shiftService.delete(id);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @UseGuards(AdminGuard)
    @Put(":id")
    async updateShift(@Param("id", ParseIntPipe) id: number, @Body() {
        name,
        startTime,
        endTime,
        minEmployees,
        wholeDay
    }: ShiftDto) {
        try {
            return this.shiftService.update(id, name, startTime, endTime, minEmployees, wholeDay);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @Get()
    async getShifts() {
        return this.shiftService.getShifts();
    }

    @UseGuards(AdminGuard)
    @Post(":date/shift/:shiftId/")
    async addShiftToDay(@Param("date") date: string, @Param("shiftId", ParseIntPipe) shiftId: number): Promise<ShiftDayEntity> {
        try {
            return await this.shiftService.addShiftToDay(date, shiftId);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @Get("date/:date")
    async getShiftsForDay(@Param("date") date: string): Promise<ShiftDayEntity[]> {
        return this.shiftService.getShiftsForDay(date);
    }

    @UseGuards(AdminGuard)
    @Delete("shiftDay/:id")
    async deleteShiftDay(@Param("id", ParseIntPipe) id: number) {
        try {
            return await this.shiftService.deleteShiftDay(id);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @Put("shiftDay/:id/join")
    async joinShiftDay(@Param("id", ParseIntPipe) shiftDay: number, @UserParam() user: UserEntity) {
        try {
            return await this.shiftService.joinShiftDay(shiftDay, user);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @Put("shiftDay/:id/quit")
    async quitShiftDay(@Param("id", ParseIntPipe) shiftDay: number, @UserParam() user: UserEntity) {
        try {
            return await this.shiftService.quitShiftDay(shiftDay, user);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @UseGuards(AdminGuard)
    @Put("shiftDay/:id/assign/:userId")
    async assignUserToShiftDay(@Param("id", ParseIntPipe) shiftDay: number, @Param("userId", ParseIntPipe) userId: number) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new BadRequestException("User not found")
        }

        try {
            return await this.shiftService.joinShiftDay(shiftDay, user);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @UseGuards(AdminGuard)
    @Put("shiftDay/:id/unassign/:userId")
    async unassignUserToShiftDay(@Param("id", ParseIntPipe) shiftDay: number, @Param("userId", ParseIntPipe) userId: number) {
        const user = await this.userService.getUserById(userId);
        if (!user) {
            throw new BadRequestException("User not found")
        }

        try {
            return await this.shiftService.quitShiftDay(shiftDay, user, true);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }

    @UseGuards(AdminGuard)
    @Post("shiftDay/copyWeek/:dateFrom/:dateTo")
    async copyWeek(@Param("dateFrom") dateFrom: string, @Param("dateTo") dateTo: string) {
        try {
            return await this.shiftService.copyWeek(dateFrom, dateTo);
        } catch (e) {
            throw new BadRequestException(e.message)
        }
    }
}
