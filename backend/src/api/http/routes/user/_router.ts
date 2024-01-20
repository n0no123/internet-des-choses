import {Router} from "express";
import { z } from "zod";

import register from "./register-controller";
import login from "./login-controller";
import claimSensor from "./claim-sensor-controller";
import releaseSensor from "./release-sensor-controller";
import ensureAuthenticated from "../../misc/middlewares/ensure-authenticated";
const router = Router();

router.put("/", async (req, res) => {
    const parseResult = z.object({
        username: z.string().min(3),
        password: z.string().min(8),
        zipcode: z.string().length(8),
    }).safeParse(req.body);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const result = await register(parseResult.data);

        res.status(result.statusCode).json(result.body);
    }
});

router.post("/", async (req, res) => {
    const parseResult = z.object({
        username: z.string().min(3),
        password: z.string().min(8),
    }).safeParse(req.body);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const result = await login(parseResult.data);

        res.status(result.statusCode).json(result.body);
    }
});

router.put("/claim-sensor/:serialNumber", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.string().transform(s => parseInt(s, 10)).refine(s => !isNaN(s))
    }).safeParse(req.params);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const user = req.user;
        const result = await claimSensor({
            serialNumber: parseResult.data.serialNumber,
            user,
        });

        res.status(result.statusCode).json(result.body);
    }
});

router.delete("/release-sensor/:serialNumber", ensureAuthenticated, async (req, res) => {
    const parseResult = z.object({
        serialNumber: z.string().transform(s => parseInt(s, 10)).refine(s => !isNaN(s))
    }).safeParse(req.params);

    if (!parseResult.success) {
        res.status(400).json(parseResult.error);
    }
    else {
        const user = req.user;
        const result = await releaseSensor({
            serialNumber: parseResult.data.serialNumber,
            user,
        });

        res.status(result.statusCode).json(result.body);
    }
});

export default router;

