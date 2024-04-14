import e from 'express';
import prisma from '../prisma/client';
import { Event,UserEvent,EventPayment,User } from '@prisma/client';


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

export const addFixedPayment = async (input:UserEvent) => {
    try {
        const data = await prisma.userEvent.update({
            where: {
                userId_eventId: {
                    eventId: input.eventId,
                    userId: input.userId,
                }
            },
            data: {
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

export const getPayEvent = async (id:string) => {
    try {
        const data = await prisma.eventPayment.findUnique({
            where: {
                id: id,
            }
        });
        return data as EventPayment;
    }
    catch (error) {
        console.error("Error in getting all users:", error);
        throw new Error(`Error in getting all users: ${error}`);
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
