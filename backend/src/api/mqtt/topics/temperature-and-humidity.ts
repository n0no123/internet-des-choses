import datasource from "../../../misc/datasource";
import {Sensor} from "../../../entities/sensor/sensor";

type TemperatureAndHumidityRecord = {
    id: string
    temperature: number;
    humidity: number;
}

const ensureObjectIsValid = (obj: unknown): obj is TemperatureAndHumidityRecord =>
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).id === "string" &&
    !Number.isNaN(parseInt((obj as Partial<TemperatureAndHumidityRecord>).id!, 10)) &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).temperature === "number" &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).humidity === "number";

const handler = async (message: string) => {
    try {
        const parsedMessage = JSON.parse(message);
        if (ensureObjectIsValid(parsedMessage)) {
            const sensorRepository = datasource.getRepository(Sensor);
            const sensor = await sensorRepository.findOne({where: {id: parseInt(parsedMessage.id, 10)}});

            if (sensor) {
                sensor.data.push({
                    temperature: parsedMessage.temperature,
                    humidity: parsedMessage.humidity,
                    timestamp: new Date().getTime(),
                });
                await sensorRepository.save(sensor);
            } else
                console.error(`Sensor with id ${parsedMessage.id} not found packet: ${message}`);
        } else
            console.error(`Invalid message received (${message})`);
    } catch (e) {
        console.error(e);
    }
};

export default handler;
