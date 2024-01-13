import {Router} from "express";

import create from "./create-controller";
import {z} from "zod";
import {SensorType} from "../../../../entities/sensor/sensor-type";
import getTemperatureAndHumiditySensorMetricsController from "./get-temperature-and-humidity-sensor-metrics-controller";
import ensureAuthenticated from "../../misc/middlewares/ensure-authenticated";

const router = Router();

router.put("/", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.number(),
        type: z.enum([SensorType.TemperatureAndHumidity]),
    }).safeParse(req.body);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const result = await create(parseResult.data);

        res.status(result.statusCode);
    }
});

router.get("/temperature-and-humidity/:serialNumber", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.number(),
    }).safeParse(req.params);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    } else {
        const result = await getTemperatureAndHumiditySensorMetricsController({
            serialNumber: parseResult.data.serialNumber,
            user: req.user,
        });

        res.status(result.statusCode).json(result.body);
    }
});

router.get("/lookup", ensureAuthenticated, async (req, res) => {
    const user = req.user;

    return res.status(200).json({
        sensors: user.sensors.map(({id, type, name}) => ({id, type, name}))
    });
});

export default router;
