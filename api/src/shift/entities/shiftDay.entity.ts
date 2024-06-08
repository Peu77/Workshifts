import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ShiftEntity} from "./shift.entity";

@Entity("shift_days")
export class ShiftDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "date"})
    date: Date;

    @ManyToOne(() => ShiftEntity)
    @JoinColumn()
    shift: ShiftEntity;

    @ManyToMany(() => UserEntity, user => user.shiftDays)
    @JoinTable()
    users: UserEntity[]
}