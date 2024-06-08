import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ShiftEntity, ShiftTime} from "./entities/shift.entity";
import {ShiftDayEntity} from "./entities/shiftDay.entity";

@Injectable()
export class ShiftService {
    constructor(
        @InjectRepository(ShiftEntity) private shiftRepository: Repository<ShiftEntity>,
        @InjectRepository(ShiftDayEntity) private shiftDayRepository: Repository<ShiftDayEntity>,
    ) {
    }

    async create(name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number) {
        const shift = new ShiftEntity();
        shift.name = name;
        shift.startTime = startTime
        shift.endTime = endTime
        shift.minEmployees = minEmployees;

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

    async getShiftsForDay(date: string) {
        return this.shiftDayRepository.find({where: {date: new Date(date)}, relations: ["shift", "users"]});
    }

    async getShifts() {
        return this.shiftRepository.find();
    }

    delete(id: number) {
        return this.shiftRepository.delete(id);
    }

    update(id: any, name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number) {
        return this.shiftRepository.update(id, {name, startTime, endTime, minEmployees});
    }
}
