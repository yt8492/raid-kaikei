import { Router } from "express";
import * as callbackRouter from "../usecase/callback";
const router = Router();

router.post('/' ,callbackRouter.callback);

export default router;