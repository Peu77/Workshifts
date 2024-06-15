import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {HolidayEntity} from "./entities/holiday.entity";
import {Between, LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";
import {HolidayDto} from "./dtos/holidayDto";

@Injectable()
export class HolidayService {
    constructor(
        @InjectRepository(HolidayEntity) private holidayRepository: Repository<HolidayEntity>,
    ) {
    }

    async loadHolidaysFromApi(year: number) {
        const response = await fetch(`https://get.api-feiertage.de/?years=${year}&states=bw`);
        const data = await response.json();
        const holidays: {
            date: string,
            fname: string
        }[] = data.feiertage;

        if (!holidays) {
            return;
        }

        const holidayEntities = holidays.map(h => {
            const holiday = new HolidayEntity();
            holiday.date = new Date(h.date);
            holiday.name = h.fname;
            return holiday;
        });

        return this.holidayRepository.save(holidayEntities);
    }

    async createHoliday(body: HolidayDto) {
        const holiday = new HolidayEntity();
        holiday.date = new Date(body.date);
        holiday.name = body.name;

        return this.holidayRepository.save(holiday);
    }

    async getHolidays(year: number) {
        const holidays = await this.holidayRepository.find({
            where: {
                date: Between(new Date(`${year}-01-01`), new Date(`${year}-12-31`))
            }
        });

        if (holidays.length === 0) {
            await this.loadHolidaysFromApi(year);
        }

        return holidays;
    }

    deleteHoliday(id: number) {
        return this.holidayRepository.delete(id);
    }

    async isHoliday(date: Date): Promise<HolidayEntity | null> {
        return this.holidayRepository.findOne({
            where: {
                date: date
            }
        });
    }
}
