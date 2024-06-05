import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ShiftEntity, ShiftTime} from "./entities/shift.entity";

@Injectable()
export class ShiftService {
    constructor(@InjectRepository(ShiftEntity) private shiftRepository: Repository<ShiftEntity>) {
    }

    async create(name: string, startTime: ShiftTime, endTime: ShiftTime, minEmployees: number) {
        const shift = new ShiftEntity();
        shift.name = name;
        shift.startTime = this.shiftTimeToDate(startTime);
        shift.endTime = this.shiftTimeToDate(endTime);
        shift.minEmployees = minEmployees;

        return this.shiftRepository.save(shift);
    }

    shiftTimeToDate(shiftTime: ShiftTime): Date {
        return new Date(0, 0, 0, shiftTime.hours, shiftTime.minutes, 0);
    }

    async getShifts() {
        return this.shiftRepository.find();
    }
}
