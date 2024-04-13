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
        console.error("Error in create event:", error);
        throw new Error(`Error in create event: ${error}`);
    }
}

export const getEventById = async (eventId: string) => {
    try {
        const data = await prisma.event.findFirst({
            where: {
                id: eventId
            }
        });
        return data;
    } catch (error) {
        console.error("Error in getting event by id:", error);
        throw new Error(`Error in getting event by id: ${error}`);
    }
}

export const getUsersByEventId = async (eventId: string) => {
    try {
        const data = await prisma.userEvent.findMany({
            where: {
                eventId: eventId
            },
            include: {
                User: true
            }
        });
        return data;
    } catch (error) {
        console.error("Error in get users by event id:", error);
        throw new Error(`Error in get users by event id: ${error}`)
    }
}

export const getPaymentsByEventId = async (eventId: string) => {
    try {
        const data = await prisma.eventPayment.findMany({
            where: {
                eventId: eventId
            }
        });
        return data;
    } catch (error) {
        console.error("Error in ge payments by event id:", error);
        throw new Error(`Error in get payments by event id: ${error}`);
    }
}
