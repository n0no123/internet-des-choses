import {Account} from "../../../../entities/account/account";
import {Handler} from "../../misc/handler";
import datasource from "../../../../misc/datasource";
import {Sensor} from "../../../../entities/sensor/sensor";

type Params = {
    serialNumber: number;
    user: Account;
}

type Response = {
    error?: string;
} | undefined

const handler: Handler<Params, Response> = async ({serialNumber, user}) => {
    const sensorRepository = datasource.getRepository(Sensor);
    const userRepository = datasource.getRepository(Account);
    const fetchedUser = await userRepository.findOne({
        where: {
            id: user.id,
        },
        relations: ["sensors"],
    });

    const sensor = await sensorRepository.findOne({
        where: {
            id: serialNumber,
        },
        relations: ["ownerAccount"],
    });

    if (fetchedUser === null) {
        return {
            statusCode: 404,
            body: {
                error: "User does not exist",
            }
        }
    }
    if (sensor === null) {
        return {
            statusCode: 404,
            body: {
                error: "Sensor does not exist",
            }
        }
    }
    if (sensor.ownerAccount === undefined) {
        return {
            statusCode: 400,
            body: {
                error: "Sensor is not claimed",
            }
        }
    }
    if (sensor.ownerAccount?.id !== fetchedUser.id) {
        return {
            statusCode: 403,
            body: {
                error: "User is not the owner of the sensor",
            }
        }
    }
    sensor.ownerAccount = undefined;
    fetchedUser.sensors = fetchedUser.sensors.filter(s => s.id !== sensor.id);
    await sensorRepository.save(sensor);
    await userRepository.save(fetchedUser);
    return {
        statusCode: 200,
        body: undefined
    }
};

export default handler;
