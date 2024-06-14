import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("holidays")
export class HolidayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: "date"})
    date: Date;
}