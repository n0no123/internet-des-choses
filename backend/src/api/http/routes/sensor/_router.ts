import {Router} from "express";

import create from "./create-controller";
import {z} from "zod";
import {SensorType} from "../../../../entities/sensor/sensor-type";
import getTemperatureAndHumiditySensorMetricsController from "./get-temperature-and-humidity-sensor-metrics-controller";
import ensureAuthenticated from "../../misc/middlewares/ensure-authenticated";
import datasource from "../../../../misc/datasource";
import {Account} from "../../../../entities/account/account";

const router = Router();

router.put("/", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.number(),
        type: z.enum([SensorType.TemperatureAndHumidity]),
        name: z.string().optional(),
    }).safeParse(req.body);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const result = await create(parseResult.data);

        res.sendStatus(result.statusCode);
    }
});

router.get("/temperature-and-humidity/:serialNumber", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.string().transform(s => parseInt(s, 10)).refine(s => !isNaN(s))
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
    const userWithSensors = await datasource.getRepository(Account)
        .findOne({
            where: { id: req.user.id },
            relations: ["sensors"],
        })

    if (userWithSensors === undefined || userWithSensors === null) {
        return res.status(500).json({ //should never happen since we're using ensureAuthenticated
            error: "Internal server error",
        });
    }

    return res.status(200).json({
        sensors: userWithSensors.sensors.map(({id, type, name}) => ({id, type, name}))
    });
});

export default router;
