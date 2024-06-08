import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShiftEntity} from "./entities/shift.entity";
import {UserModule} from "../user/user.module";
import {ShiftDayEntity} from "./entities/shiftDay.entity";


@Module({
  imports: [TypeOrmModule.forFeature([ShiftEntity, ShiftDayEntity]), UserModule],
  controllers: [ShiftController],
  providers: [ShiftService]
})
export class ShiftModule {}
