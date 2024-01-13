import {Handler} from "../misc/handler";
import datasource from "../../../misc/datasource";
import mqttApp from "../../mqtt/server";

type Response = {
    database: string;
    mqtt: string;
}

const handler: Handler<undefined, Response> = async () => {
    const dbStatus = datasource.isInitialized;
    const mqttStatus = mqttApp.connected;

    return {
        body: {
            database: dbStatus ? "OK" : "Not connected",
            mqtt: mqttStatus ? "OK" : "Not connected",
        },
        statusCode: dbStatus ? 200 : 500,
    }
}

export default handler;
