import {Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity("shift_days")
export class ShiftDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "date"})
    date: Date;

    @ManyToMany(() => UserEntity, user => user.shiftDays)
    @JoinColumn()
    users: UserEntity[]
}