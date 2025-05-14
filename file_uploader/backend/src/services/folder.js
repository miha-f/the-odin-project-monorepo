import prisma from '../db/prisma.js';

export const createFolderService = () => ({
    getAll: async (client = prisma) => await prisma.folder.findMany(),

    getByUuid: async (uuid, client = prisma) =>
        await client.folder.findUnique({
            where: { uuid },
        }),

    create: async (data, client = prisma) =>
        await client.folder.create({
            data,
        }),

    update: async (uuid, data, client = prisma) =>
        await client.folder.update({
            where: { uuid },
            data,
        }),

    delete: async (uuid, client = prisma) =>
        await client.folder.delete({
            where: { uuid },
        }),
});
