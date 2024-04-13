import express, { Router } from "express";
import * as eventRouter from "../usecase/event";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/api/event' ,eventRouter.event);

export default router;