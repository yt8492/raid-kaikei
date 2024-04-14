import prisma from '../prisma/client';
import { Event,UserEvent,EventPayment } from '@prisma/client';


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

export const getEvent = async (id:string) => {
    try {
        const data = await prisma.event.findUnique({
            where: {
                id: id,
            }
        });
        return data as Event;
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}

export const getUserEvents = async (id:string) => {
    try {
        const data = await prisma.userEvent.findMany({
            where: {
                userId: id,
            }
        });
        return data as UserEvent[];
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}

export const createPayEvent = async (input:EventPayment) => {
    try {
        const data = await prisma.eventPayment.create({
            data: {
                id: input.id,
                eventId: input.eventId,
                claimantId: input.claimantId,
                amount: input.amount,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        return data as EventPayment;
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
    }
}
