import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ShiftEntity, ShiftTime} from "./entities/shift.entity";
import {ShiftDayEntity} from "./entities/shiftDay.entity";
import {UserEntity} from "../user/entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(ShiftEntity) private shiftRepository: Repository<ShiftEntity>,
        @InjectRepository(ShiftDayEntity) private shiftDayRepository: Repository<ShiftDayEntity>,
        private configService: ConfigService,
    ) {
    }

    DAYS_BEFORE_ABLE_TO_QUIT = this.configService.getOrThrow<number>("DAYS_BEFORE_ABLE_TO_QUIT")

    async create(name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number, wholeDay: boolean) {
        const shift = new ShiftEntity();
        shift.name = name;
        shift.startTime = startTime
        shift.endTime = endTime
        shift.minEmployees = minEmployees;
        shift.wholeDay = wholeDay;

        return this.shiftRepository.save(shift);
    }

    async addShiftToDay(date: string, shiftId: number) {
        const shift = await this.shiftRepository.findOneBy({id: shiftId})
        if (!shift) {
            throw new Error("Shift not found")
        }

        const shiftDay = new ShiftDayEntity();
        shiftDay.date = new Date(date);
        shiftDay.shift = shift;
        shiftDay.users = [];

        return this.shiftDayRepository.save(shiftDay);
    }

    async joinShiftDay(shiftDay: number, user: UserEntity) {
        const shiftDayEntity = await this.shiftDayRepository.findOne({where: {id: shiftDay}, relations: ["users"]});
        if (!shiftDayEntity) {
            throw new Error("Shift day not found")
        }

        if (shiftDayEntity.users.some(u => u.id === user.id)) {
            throw new Error("User already in shift day")
        }

        shiftDayEntity.users.push(user);

        return this.shiftDayRepository.save(shiftDayEntity);
    }

    async quitShiftDay(shiftDay: number, user: UserEntity, force: boolean = false) {
        const shiftDayEntity = await this.shiftDayRepository.findOne({
            where: {id: shiftDay},
            relations: ["users", "shift"]
        });
        if (!shiftDayEntity) {
            throw new Error("Shift day not found")
        }

        if (!shiftDayEntity.users.some(u => u.id === user.id)) {
            throw new Error("User not found in shift day")
        }

        if (shiftDayEntity.users.length <= shiftDayEntity.shift.minEmployees && !force) {
            throw new Error("Shift day has minimum employees")
        }

        const now = new Date();
        const diff = (shiftDayEntity.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

        if (diff < 0 && !force) {
            throw new Error(`Cannot quit shift in the past`)
        }

        if (diff < this.DAYS_BEFORE_ABLE_TO_QUIT && !force) {
            throw new Error(`Cannot quit shift ${this.DAYS_BEFORE_ABLE_TO_QUIT} days before`)
        }


        shiftDayEntity.users = shiftDayEntity.users.filter(u => u.id !== user.id);
        return this.shiftDayRepository.save(shiftDayEntity);
    }

    deleteShiftDay(id: number) {
        return this.shiftDayRepository.delete(id);
    }

    async getShiftsForDay(date: string) {
        return this.shiftDayRepository.find({where: {date: new Date(date)}, relations: ["shift", "users"]});
    }

    async getShifts() {
        return this.shiftRepository.find();
    }

    delete(id: number) {
        return this.shiftRepository.delete(id);
    }

    update(id: any, name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number, wholeDay: boolean) {
        return this.shiftRepository.update(id, {name, startTime, endTime, minEmployees, wholeDay});
    }

    async copyWeek(dateFromString: string, dateToString: string) {
        const dateFrom = new Date(dateFromString)
        const dateTo = new Date(dateToString)
        const map = new Map<number, ShiftDayEntity[]>()

        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + i)
            const shiftDays = await this.getShiftsForDay(date.toISOString())
            map.set(i, shiftDays)
        }

        for (let day = dateFrom; day <= dateTo; day.setDate(day.getDate() + 1)) {
            const shiftDays = map.get(day.getDay())
            console.log(day.toLocaleDateString('de'), shiftDays?.length)

            // delete all shift days for this day
            const shiftToDelete = await this.getShiftsForDay(day.toISOString())
            for (const shift of shiftToDelete) {
                await this.deleteShiftDay(shift.id)
            }

            if (shiftDays) {
                for (const shiftDay of shiftDays) {
                    const newShiftDay = new ShiftDayEntity()
                    newShiftDay.date = day
                    newShiftDay.shift = shiftDay.shift
                    newShiftDay.users = []
                    await this.shiftDayRepository.save(newShiftDay)
                }
            }
        }

        return true
    }
}
