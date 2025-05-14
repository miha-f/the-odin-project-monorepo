import prisma from '../db/prisma.js';

export const createUserService = () => ({
    getAll: async (client = prisma) => await client.user.findMany(),

    getByUuid: async (uuid, client = prisma) =>
        await client.user.findUnique({
            where: { id: uuid },
        }),

    getByUsername: async (username, client = prisma) =>
        await client.user.findUnique({
            where: { username: username }
        }),

    create: async (data, client = prisma) =>
        await client.user.create({
            data,
        }),

    update: async (uuid, data, client = prisma) =>
        await client.user.update({
            where: { id: uuid },
            data,
        }),

    delete: async (uuid, client = prisma) =>
        await client.user.delete({
            where: { id: uuid },
        }),
});
