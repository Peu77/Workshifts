import {Column, PrimaryGeneratedColumn, Entity, ManyToMany, OneToMany} from "typeorm";
import {ShiftDayEntity} from "../../shift/entities/shiftDay.entity";
import {Exclude} from "class-transformer";
import {VacationEntity} from "../../vacation/entities/vacation.entity";

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @ManyToMany(() => ShiftDayEntity, shiftDay => shiftDay.users)
    shiftDays: ShiftDayEntity[]

    @OneToMany(() => VacationEntity, vacation => vacation.user)
    vacations: VacationEntity[]
}

export interface TokenPayload {
    id: number;
    email: string;
}