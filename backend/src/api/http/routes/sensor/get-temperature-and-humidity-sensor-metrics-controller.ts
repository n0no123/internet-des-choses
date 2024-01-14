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
} | {
    metrics: {
        temperature: number;
        humidity: number;
        timestamp: number;
    }[]
}

const handler: Handler<Params, Response> = async ({serialNumber, user}) => {
    const sensorRepository = datasource.getRepository(Sensor);
    const sensor = await sensorRepository.findOne({
        where: {
            id: serialNumber,
        },
        relations: ["ownerAccount"],
    });

    if (sensor === null) {
        return {
            statusCode: 404,
            body: {
                error: "Sensor does not exist",
            }
        }
    } else {
        if (sensor.ownerAccount?.id !== user.id) {
            return {
                statusCode: 403,
                body: {
                    error: "User is not the owner of the sensor",
                }
            }
        } else {
            return {
                statusCode: 200,
                body: {
                    metrics: sensor.data
                }
            }
        }
    }
};

export default handler;
