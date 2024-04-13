import { Request, Response } from 'express';
import * as eventDB from '../infra/event';
import { Event } from '@prisma/client';
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
