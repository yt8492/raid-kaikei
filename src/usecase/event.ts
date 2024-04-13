import { NextFunction, Request, Response } from 'express';
import * as eventDB from '../infra/event';
import { Event } from '@prisma/client';
import {verifyIdToken} from '../api/LineApi';
import { v4 as uuidv4 } from 'uuid';

export const event = async (req: Request, res: Response): Promise<Response> => {

const request = req.body;

// const eventInput = Event{
const token =req.headers.authorization as string;
const words = token.split(' ')[1];
  let profile= await verifyIdToken(words, process.env.CHANNEL_ID as string);
  if (!profile) {
    return res.status(400).json({ error: "Invalid token" });
  }
const eventInput = {
  id: uuidv4(),
  title: request.title,
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
 };
 let data: Event;
try {
  data =await eventDB.createEvent(eventInput as Event);
} catch (error) {
  console.error("Error in creating user:", error);
  throw new Error(`Error in creating user: ${error}`);
}
    return res.status(200).json({
      url: `https://line.yuorei.com/invite/${data.id}`
    });
  }

export const getEventById = (req: Request, res: Response, next: NextFunction) => (async () => {
  const eventId = req.params["id"];
  const event = await eventDB.getEventById(eventId);
  if (event === null) {
    res.status(404);
    return;
  }
  const users = await eventDB.getUsersByEventId(event.id);
  const eventPayments = await eventDB.getPaymentsByEventId(event.id);
  const total = eventPayments.reduce((acc, val) => acc + val.amount, 0);
  const remeiningAmount = users.reduce((acc, user) => {
    if (user.fixedPayment !== null) {
      return acc - user.fixedPayment;
    } else {
      return acc;
    }
  }, total);
  const notFixedUserCount = users.filter((u => u.fixedPayment === null)).length;
  const notFixedUserAmount = Math.floor(remeiningAmount / notFixedUserCount);
  const paymentUsers = users.map((u => {
    const payment = u.fixedPayment !== null ? u.fixedPayment : notFixedUserAmount;
    return {
      id: u.userId,
      name: u.User.name,
      imageUrl: u.User.imageUrl,
      payment: payment
    }
  }));
  const resBody = {
    id: event.id,
    title: event.title,
    totalPayment: total,
    users: paymentUsers
  };
  res.status(200);
  res.json(resBody);
})().catch(next);
