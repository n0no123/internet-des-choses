import { config } from "dotenv";

config();

const getEnv = (key: string) => {
    const value = process.env[key];
    if (value === undefined)
        throw new Error(`Environment variable ${key} is not defined.`);
    return value;
}

const asInt = (value: string) => {
    const parsed = parseInt(value);
    if (isNaN(parsed))
        throw new Error(`'${value}' is not an integer.`);
    return parsed;
}

const env = {
    bcryptRounds: asInt(getEnv("BCRYPT_ROUNDS")),
    openWeatherMapApiKey: getEnv("OPEN_WEATHER_MAP_API_KEY"),
    postgres: {
        host: getEnv("POSTGRES_HOST"),
        port: asInt(getEnv("POSTGRES_PORT")),
        username: getEnv("POSTGRES_USER"),
        password: getEnv("POSTGRES_PASSWORD"),
        database: getEnv("POSTGRES_DB"),
    },
    mqtt: {
        broker_url: getEnv("MQTT_BROKER_URL"),
        tcpPort: asInt(getEnv("MQTT_TCP_PORT")),
        wsPort: asInt(getEnv("MQTT_WS_PORT")),
        temperatureAndHumidityTopic: getEnv("MQTT_TEMPERATURE_AND_HUMIDITY_TOPIC"),
    },
    jwt: {
        secret: getEnv("JWT_SECRET"),
        expiresIn: getEnv("JWT_EXPIRES_IN"),
    }
}

export default env;
