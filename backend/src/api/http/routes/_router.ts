import { Router } from "express";

import userRouter from "./user/_router";
import sensorRouter from "./sensor/_router";

import heartbeatHandler from "./heartbeat";

const router = Router();

router.get("/heartbeat", async (_, res) => {
    const result = await heartbeatHandler(undefined);

    res.status(result.statusCode).json(result.body);
});

router.use("/user", userRouter);
router.use("/sensor", sensorRouter);

export default router;
