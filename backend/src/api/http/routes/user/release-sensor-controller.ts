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

    if (sensor === null) {
        return {
            statusCode: 404,
            body: {
                error: "Sensor does not exist",
            }
        }
    } else {
        sensor.ownerAccount = undefined;
        user.sensors = user.sensors.filter(s => s.id !== sensor.id);
        await sensorRepository.save(sensor);
        await userRepository.save(user);
        return {
            statusCode: 200,
            body: undefined
        }
    }
};

export default handler;
