import prisma from '../db/prisma.js';
import withCatch from '../helpers/withCatch.js';

export const createSearchService = () => ({
    files: async (userId, query, client = prisma) => {
        const [error, result] = await withCatch(() =>
            client.file.findMany({
                where: {
                    ownerId: userId,
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                orderBy: { updatedAt: 'desc' },
                take: 100,
            })
        );
        if (error)
            return { error: "Database error" };
        return { result: result };
    },

    // NOTE(miha): How to find shared with folders
    //    prisma.folder.findMany({
    //   where: {
    //     sharedWith: {
    //       some: {
    //         userId: userId,
    //       },
    //     },
    //     name: { contains: query, mode: 'insensitive' },
    //   },
    //   take,
    //   skip,
    //   orderBy: { updatedAt: 'desc' },
    // }),

    folders: async (userId, query, client = prisma) => {
        const [error, result] = await withCatch(() =>
            client.folder.findMany({
                where: {
                    ownerId: userId,
                    name: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                orderBy: { updatedAt: 'desc' },
                take: 100,
            })
        );
        if (error)
            return { error: "Database error" };
        return { result: result };
    },
})
