import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ShiftEntity} from "./entities/shift.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ShiftEntity])],
  controllers: [ShiftController],
  providers: [ShiftService]
})
export class ShiftModule {}
