import { PrismaClient, Prisma } from '@prisma/client';
import { User, UserDbInterface, UserGetAllOptions, UserUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

export const createUserPrismaDb = (prisma: PrismaClient): UserDbInterface => {
    return {
        getById: async (uuid: Uuid): DbResult<User> => {
            return prisma.user.findUnique({ where: { uuid } });
        },

        getByUsername: async (username: string): DbResult<User> => {
            return prisma.user.findUnique({ where: { username } });
        },

        getAll: async (options: UserGetAllOptions): DbResult<User[]> => {
            const {
                page = 1,
                limit = 10,
                sort = 'createdAt',
                order = 'desc',
                ids,
                search
            } = options;

            const where: Prisma.UserWhereInput = {
                ...(search && {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                    ],
                }),

                ...(ids && ids.length > 0 && {
                    uuid: { in: ids },
                }),
            };

            return prisma.user.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sort]: order,
                },
            });
        },

        create: async (
            username: string,
            passwordHash: string,
        ): DbResult<User> => {
            return prisma.user.create({
                data: {
                    username,
                    passwordHash,
                },
            });
        },

        update: async (uuid: Uuid, data: UserUpdateData): DbResult<User> => {
            return prisma.user.update({
                where: { uuid },
                data,
            });
        },

        remove: async (uuid: Uuid): DbResult<User> => {
            return prisma.user.delete({
                where: { uuid },
            });
        },
    };
};

