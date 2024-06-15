import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {VacationEntity} from "./entities/vacation.entity";
import {LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";

@Injectable()
export class VacationService {
    constructor(
        @InjectRepository(VacationEntity) private vacationRepository: Repository<VacationEntity>
    ) {
    }

    async createVacation(userId: number, description: string, startDate: Date, endDate: Date) {
        const vacation = this.vacationRepository.create({user: {id: userId}, description, startDate, endDate});
        return await this.vacationRepository.save(vacation);
    }

    getVacations(id: number) {
        return this.vacationRepository.find({where: {user: {id}}});
    }

    deleteVacation(id: number) {
        return this.vacationRepository.delete(id);
    }

    async getVacationsOnDay(day: Date) {
        const vacations = await this.vacationRepository.find({
            where: {
                startDate: LessThanOrEqual(day),
                endDate: MoreThanOrEqual(day)
            },
            relations: ["user"],
        });

        return vacations.filter((vacation, index, self) =>
                index === self.findIndex((v) => (
                    v.user.id === vacation.user.id
                ))
        );
    }
}
