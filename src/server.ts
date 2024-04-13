import express, { Application } from 'express'
import callback from "./router/callback";

import {
    middleware,
    MiddlewareConfig,
  } from '@line/bot-sdk';

const app: Application = express()

const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.CHANNEL_SECRET || '',
};

app.use(middleware(middlewareConfig));



// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  next()
})

app.use('/callback',callback);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

export default app;