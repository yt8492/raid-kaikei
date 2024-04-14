import { NextFunction, Request, Response } from 'express';
import * as eventDB from '../infra/event';
import { Event,UserEvent,EventPayment } from '@prisma/client';
import { verifyIdToken } from '../api/LineApi';
import { v4 as uuidv4 } from 'uuid';

export const event = async (req: Request, res: Response): Promise<Response> => {
  const request = req.body;

  const token = req.headers.authorization as string;
  const words = token.split(' ')[1];
  let profile = await verifyIdToken(words, process.env.CHANNEL_ID as string);
  if (!profile) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const eventInput: Event = {
    id: uuidv4(),
    title: request.title,
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let data: Event;
  try {
    data = await eventDB.createEvent(eventInput);
  } catch (error) {
    console.error("Error in creating event:", error);
    throw new Error(`Error in creating event: ${error}`);
  }


  return res.status(200).json({
    url: `https://line.yuorei.com/invite/${data.id}`
  });
}

export const getevents = async (req: Request, res: Response): Promise<Response> => {
  let data: Event[];
  try {
    data = await eventDB.getEvents();
  } catch (error) {
    console.error("Error in getting all events:", error);
    throw new Error(`Error in getting all events: ${error}`);
  }
  return res.status(200).json(data);
}

export const eventJoin = async (req: Request, res: Response): Promise<Response> => {
  const eventId = req.params.id;

  const token = req.headers.authorization as string;
  const words = token.split(' ')[1];
  let profile = await verifyIdToken(words, process.env.CHANNEL_ID as string);
  if (!profile) {
    return res.status(400).json({ error: "Invalid token" });
  }

  let data: UserEvent = {
    eventId: eventId,
    userId: profile.id,
    paymentStatus: 0,
    fixedPayment: null,
  };
  

  try {
    data = await eventDB.joinEvent(data);
  } catch (error) {
    console.error("Error in getting event:", error);
    throw new Error(`Error in getting event: ${error}`);
  }

  if (!data) {
    return res.status(404).json({ error: "Event not found" });
  }

  return res.status(200).json("data");
}

export const createPayEvent = async (req: Request, res: Response): Promise<Response> => {
  const eventId = req.params.id;
  const request = req.body;

  const token = req.headers.authorization as string;
  const words = token.split(' ')[1];
  let profile = await verifyIdToken(words, process.env.CHANNEL_ID as string);
  if (!profile) {
    return res.status(400).json({ error: "Invalid token" });
  }

  let data: EventPayment = {
    id: uuidv4(),
    eventId: eventId,
    claimantId: profile.id,
    amount: request.amount,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    data = await eventDB.createPayEvent(data);
  } catch (error) {
    console.error("Error in getting event:", error);
    throw new Error(`Error in getting event: ${error}`);
  }

  if (!data) {
    return res.status(404).json({ error: "Event not found" });
  }

  return res.status(200).json(data);
}

export const addFixedPayment = async (req: Request, res: Response): Promise<Response> => {
  const eventId = req.params.id;
  const request = req.body;

  const token = req.headers.authorization as string;
  const words = token.split(' ')[1];
  let profile = await verifyIdToken(words, process.env.CHANNEL_ID as string);
  if (!profile) {
    return res.status(400).json({ error: "Invalid token" });
  }

  let data: UserEvent = {
    eventId: eventId,
    userId: profile.id,
    paymentStatus: 0,
    fixedPayment: request.amount,
  };

  try {
    data = await eventDB.addFixedPayment(data);
  } catch (error) {
    console.error("Error in getting event:", error);
    throw new Error(`Error in getting event: ${error}`);
  }

  if (!data) {
    return res.status(404).json({ error: "Event not found" });
  }

  return res.status(200).json(data);
}

export const getPayEvent = async (req: Request, res: Response): Promise<Response> => {
  const eventId = req.params.id;
  const payId = req.params.pay_id;


  try {
    const event = await eventDB.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
  } catch (error) {
    console.error("Error in getting event:", error);
    throw new Error(`Error in getting event: ${error}`);
  }

  let data: EventPayment;
  try {
    data = await eventDB.getPayEvent( payId);
  } catch (error) {
    console.error("Error in getting event:", error);
    throw new Error(`Error in getting event: ${error}`);
  }

  if (!data) {
    return res.status(404).json({ error: "Event not found" });
  }

  return res.status(200).json(data);
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

