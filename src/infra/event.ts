import prisma from '../prisma/client';
import { Event,UserEvent, } from '@prisma/client';


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

export const getEvents = async () => {
    try {
        const data = await prisma.event.findMany();
        return data as Event[];
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}

export const joinEvent = async (input:UserEvent) => {
    try {
        const data = await prisma.userEvent.create({
            data: {
                eventId: input.eventId,
                userId: input.userId,
                // createdAt: new Date(),
                // updatedAt: new Date(),
                paymentStatus: input.paymentStatus,
                fixedPayment: input.fixedPayment,
            }
        });
        return data as UserEvent;
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}