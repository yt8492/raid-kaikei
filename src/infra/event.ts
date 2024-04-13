import prisma from '../prisma/client';
import { Event } from '@prisma/client';


export const createEvent = async (event:Event) => {
    try {
        const data = await prisma.event.create({
            data: {
                id: event.id,
                title: event.title,
                description: event.description,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        return data as Event;
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}