import { Router } from "express";
import * as callbackRouter from "../usecase/callback";
import { MiddlewareConfig, middleware } from "@line/bot-sdk";

const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.CHANNEL_SECRET || '',
};

const router = Router();
router.use(middleware(middlewareConfig));

router.post('/' ,callbackRouter.callback);

export default router;