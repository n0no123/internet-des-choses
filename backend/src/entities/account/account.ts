import {BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {compareSync, hashSync} from "bcrypt";
import { v4 } from "uuid";
import env from "../../misc/env";
import {Sensor} from "../sensor/sensor";
import {AccountPermissionLevel} from "./account-permission-level";

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true, nullable: false })
    username!: string;

    @Column({ nullable: false })
    private hashedPassword!: string;

    @Column({
        type: "enum",
        enum: AccountPermissionLevel,
        nullable: false,
        default: AccountPermissionLevel.USER
    })
    permissionLevel!: AccountPermissionLevel;

    @OneToMany(() => Sensor, (sensor) => sensor.ownerAccount)
    sensors!: Sensor[];

    setPassword(password: string) {
        this.hashedPassword = hashSync(password, env.bcryptRounds);
    }

    comparePassword(password: string) {
        return compareSync(password, this.hashedPassword);
    }
}
