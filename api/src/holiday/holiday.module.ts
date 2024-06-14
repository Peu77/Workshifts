import {Module} from '@nestjs/common';
import {HolidayController} from './holiday.controller';
import {HolidayService} from './holiday.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HolidayEntity} from "./entities/holiday.entity";
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([HolidayEntity]), UserModule],
    controllers: [HolidayController],
    providers: [HolidayService]
})
export class HolidayModule {
}
