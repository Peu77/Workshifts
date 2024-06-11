import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity("shifts")
export class ShiftEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: "time", transformer: {
            from(value: string): ShiftTime {
                const split = value.split(":")
                return {
                    hours: parseInt(split[0]),
                    minutes: parseInt(split[1])
                }
            },
            to(value: ShiftTime): Date {
                const date = new Date()
                date.setHours(value.hours)
                date.setMinutes(value.minutes)
                return date
            }
        }
    })
    startTime: ShiftTime;

    @Column({
        type: "time", transformer: {
            from(value: string): any {
                const split = value.split(":")
                return {
                    hours: parseInt(split[0]),
                    minutes: parseInt(split[1])
                }
            },
            to(value: ShiftTime): Date {
                const date = new Date()
                date.setHours(value.hours)
                date.setMinutes(value.minutes)
                return date
            }
        }
    })
    endTime: ShiftTime;

    @Column()
    minEmployees: number;

    @Column({default: false})
    wholeDay: boolean;
}

export interface ShiftTime {
    hours: number;
    minutes: number;
}

