import {Module} from '@nestjs/common';
import {VacationController} from './vacation.controller';
import {VacationService} from './vacation.service';
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {VacationEntity} from "./entities/vacation.entity";

@Module({
    imports: [TypeOrmModule.forFeature([VacationEntity]), UserModule],
    controllers: [VacationController],
    providers: [VacationService],
    exports: [VacationService]
})
export class VacationModule {
}
