import datasource from "../../../misc/datasource";
import {Sensor} from "../../../entities/sensor/sensor";

type TemperatureAndHumidityRecord = {
    id: number;
    temperature: number;
    humidity: number;
}

const ensureObjectIsValid = (obj: unknown): obj is TemperatureAndHumidityRecord =>
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).id === "number" &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).temperature === "number" &&
    typeof (obj as Partial<TemperatureAndHumidityRecord>).humidity === "number";

const handler = async (message: string) => {
    try {
        const parsedMessage = JSON.parse(message);
        if (ensureObjectIsValid(parsedMessage)) {
            const sensorRepository = datasource.getRepository(Sensor);
            const sensor = await sensorRepository.findOne({where: {id: parsedMessage.id}});

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
