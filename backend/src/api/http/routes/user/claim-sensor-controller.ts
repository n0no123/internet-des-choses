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
    const sensor = await sensorRepository.findOne({
        where: {
            id: serialNumber,
        },
    });
    const userWithSensors = await userRepository.findOne({
        where: { id: user.id },
        relations: ["sensors"],
    });

    if (userWithSensors === null) {
        return { //should never happen since we're using ensureAuthenticated
            statusCode: 500,
            body: {
                error: "Internal server error",
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
    if (sensor.ownerAccount !== undefined) {
        return {
            statusCode: 400,
            body: {
                error: "Sensor is already claimed",
            }
        }
    }
    sensor.ownerAccount = userWithSensors;
    userWithSensors.sensors.push(sensor);
    await sensorRepository.save(sensor);
    await userRepository.save(userWithSensors);
    return {
        statusCode: 200,
        body: undefined,
    }
};

export default handler;
