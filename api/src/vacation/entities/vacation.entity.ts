import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";

@Entity("vacation")
export class VacationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: ""})
    description: string;

    @ManyToOne(() => UserEntity, user => user.vacations)
    user: UserEntity;

    @Column({type: "date"})
    startDate: Date;

    @Column({type: "date"})
    endDate: Date;
}