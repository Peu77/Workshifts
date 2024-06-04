import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("shifts")
export class ShiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: "time"})
    startTime: Date;

    @Column({type: "time"})
    endTime: Date;

    @Column()
    minEmployees: number;
}

export interface ShiftTime{
    hours: number;
    minutes: number;
}

