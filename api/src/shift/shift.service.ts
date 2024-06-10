import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ShiftEntity, ShiftTime} from "./entities/shift.entity";
import {ShiftDayEntity} from "./entities/shiftDay.entity";
import {UserEntity} from "../user/entities/user.entity";

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

    async quitShiftDay(shiftDay: number, user: UserEntity) {
        const shiftDayEntity = await this.shiftDayRepository.findOne({where: {id: shiftDay}, relations: ["users"]});
        if (!shiftDayEntity) {
            throw new Error("Shift day not found")
        }

        if (!shiftDayEntity.users.some(u => u.id === user.id)) {
            throw new Error("User not found in shift day")
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

    update(id: any, name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number) {
        return this.shiftRepository.update(id, {name, startTime, endTime, minEmployees});
    }
}
