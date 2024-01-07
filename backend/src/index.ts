import datasource from "./misc/datasource"
import app from "./api/http/server";
import mqttClient from "./api/mqtt/server";

const main = async () => {
    await datasource.initialize();
    await datasource.synchronize(true);

    const mqtt = mqttClient;

    app.listen(8080, () => {
        console.log("Listening on port 8080");
    });
};

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
