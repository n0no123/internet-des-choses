import {Handler} from "../../misc/handler";
import {SensorType} from "../../../../entities/sensor/sensor-type";
import {Sensor} from "../../../../entities/sensor/sensor";
import datasource from "../../../../misc/datasource";

type Params = {
    type: SensorType;
    serialNumber: number;
    name?: string | undefined;
}

type Response = {
    error?: string;
} | undefined

const handler: Handler<Params, Response> = async ({type, serialNumber, name}) => {
    const sensorRepository = datasource.getRepository(Sensor);
    const doesSensorExist = await sensorRepository.findOne({
        where: {
            id: serialNumber,
        },
    });

    if (doesSensorExist !== null) {
        return {
            statusCode: 400,
            body: {
                error: "Sensor already exists",
            }
        }
    } else {
        const newSensor = sensorRepository.create();
        newSensor.id = serialNumber;
        newSensor.type = type;
        newSensor.data = [];
        newSensor.name = name ?? "Unnamed sensor";
        await sensorRepository.save(newSensor);

        return {
            statusCode: 200,
            body: undefined,
        }
    }
};


export default handler;
