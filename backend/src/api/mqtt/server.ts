import {connect} from "mqtt";
import env from "../../misc/env";

import temperatureAndHumidityTopicHandler from "./topics/temperature-and-humidity";

const topics: Record<string, (_: string) => Promise<void>> = {
    temperatureAndHumidityTopic: temperatureAndHumidityTopicHandler
}

console.log("Connecting to MQTT broker");

const createApp = () => {
    const app = connect(env.mqtt.broker_url, {
        clientId: "server",
        port: env.mqtt.tcpPort,
    })

    app.on("connect", () => {
        console.log("Connected to MQTT broker");

        Object.entries(topics).forEach(([topic, handler]) => {
            app.subscribe(topic);
        });
        console.log("Subscribed to MQTT topics:", Object.keys(topics));
    });

    app.on("error", (err) => {
        console.error("MQTT error:", err);
    });

// --- MQTT topics ---

    app.on("message", async (topic, message) => {
        const handler = topics[topic];

        if (handler !== undefined) {
            await handler(message.toString());
        }
    });

    return app;
}

export default createApp();
