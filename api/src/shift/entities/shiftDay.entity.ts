import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ShiftEntity} from "./shift.entity";

@Entity("shift_days")
export class ShiftDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "date", transformer: {
            from: (value: string) => {
                return new Date(value)
            },
            to: (value: Date) => {
                return value
            }
        }
    })
    date: Date;

    @ManyToOne(() => ShiftEntity, {cascade: true, onDelete: "CASCADE"})
    @JoinColumn()
    shift: ShiftEntity;

    @ManyToMany(() => UserEntity, user => user.shiftDays)
    @JoinTable()
    users: UserEntity[]
}