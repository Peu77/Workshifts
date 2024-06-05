import {Column, PrimaryGeneratedColumn, Entity, ManyToMany} from "typeorm";
import {ShiftDayEntity} from "../../shift/entities/shiftDay.entity";

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
}

export interface TokenPayload {
    id: number;
    email: string;
}