import { Request, Response } from 'express';
import * as eventDB from '../infra/event';
import { Event } from '@prisma/client';

export const event = async (req: Request, res: Response): Promise<Response> => {

const request = req.body;
// const eventInput = Event{
  let id =""
const eventInput = {
  id: id,
  title: request.title,
  description: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
try {
  await eventDB.createEvent(eventInput as Event);
} catch (error) {
  console.error("Error in creating user:", error);
  throw new Error(`Error in creating user: ${error}`);
}
    // Return a successful message.
    return res.status(200).json({
      status: 'success',
    });
  }
