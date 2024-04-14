import express, { Router } from "express";

import * as eventRouter from "../usecase/event";

import {verifyIdToken } from "../api/LineApi";


const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/event' ,eventRouter.event);
router.post('/event/:id/join' ,eventRouter.eventJoin);
router.post('/event/:id/' ,eventRouter.createPayEvent);
router.get('/event' ,eventRouter.getevents);

router.get('/verify', (req, res, next) => (async () => {
  const authorization = req.headers.authorization;
  const clientId = process.env.CHANNEL_ID;
  if (authorization !== undefined && authorization.split(" ")[0] === "Bearer" && clientId !== undefined) {
    const idToken = authorization.split(" ")[1];
    const user = await verifyIdToken(idToken, clientId);
    res.json(user);
    res.status(200);
  } else {
    res.status(400);
  }
})().catch(next));


export default router;