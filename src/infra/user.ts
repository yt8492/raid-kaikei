import { User } from '@prisma/client';
import prisma from '../prisma/client';
export const createUser = async (payload: User) => {
    try {
        const data = await prisma.user.create({
            data: {
                id: payload.id,
                name: payload.name,
                imageUrl: payload.imageUrl,
            }
        });
        return data as User;
    } catch (error) {
        console.error("Error in create user:", error);
        // throw new Error(`Error in create user: ${error}`);
    }
}

export const getUserByID = async (id: string) => {
    try {
        const data = await prisma.user.findUnique({
            where: {
                id: id,
            }
        });
        return data as User;
    } catch (error) {
        console.error("Error in getting user:", error);
        throw new Error(`Error in getting user: ${error}`);
    }
}