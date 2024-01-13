import {SensorType} from "./sensor-type";
import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Account} from "../account/account";
import {TemperatureAndHumidityRecord} from "./temperature-and-humidity-record";

@Entity()
export class Sensor {
    @PrimaryColumn({
        type: "integer",
        nullable: false,
    })
    id!: number;

    @Column({
        type: "enum",
        enum: SensorType,
        default: SensorType.TemperatureAndHumidity,
    })
    type!: SensorType;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    name!: string;

    @ManyToOne(() => Account, account => account.sensors)
    @JoinColumn()
    ownerAccount: Account | undefined;

    @Column({
        type: "simple-json",
        nullable: false,
    })
    data!: Array<TemperatureAndHumidityRecord>
}
