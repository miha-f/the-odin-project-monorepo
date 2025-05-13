import prisma from '../db/prisma.js';

export const createFileService = () => ({
    getAll: async () => await prisma.file.findMany(),

    getByUuid: async (uuid) =>
        await prisma.file.findUnique({
            where: { uuid },
        }),

    create: async (data) =>
        await prisma.file.create({
            data,
        }),

    update: async (uuid, data) =>
        await prisma.file.update({
            where: { uuid },
            data,
        }),

    delete: async (uuid) =>
        await prisma.file.delete({
            where: { uuid },
        }),
});
