import express, { Application } from 'express'
import callback from "./router/callback";
import api from "./router/api";

import {
    middleware,
    MiddlewareConfig,
  } from '@line/bot-sdk';

const app: Application = express()

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

app.use('/callback', callback);
app.use('/api', api);

export default app;