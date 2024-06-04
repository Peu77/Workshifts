import {Column, PrimaryGeneratedColumn, Entity, ManyToMany} from "typeorm";
import {ShiftDayEntity} from "../../shift/entities/shiftDay.entity";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => ShiftDayEntity, shiftDay => shiftDay.users)
    shiftDays: ShiftDayEntity[]
}

export interface TokenPayload {
    id: number;
    email: string;
}