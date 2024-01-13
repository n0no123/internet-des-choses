import {DataSource} from "typeorm";
import {Account} from "../entities/account/account";
import {Sensor} from "../entities/sensor/sensor";
import env from "./env";

const datasource = new DataSource({
    type: "postgres",
    host: env.postgres.host,
    port: env.postgres.port,
    username: env.postgres.username,
    password: env.postgres.password,
    database: env.postgres.database,
    entities: [
        Account,
        Sensor
    ],
    synchronize: true,
    logging: "all"
});

export default datasource;
