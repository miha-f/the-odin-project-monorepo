import { PrismaClient } from '@prisma/client';
import { DB } from "@/db/db";
import { createUserPrismaDb } from "@/api/user";
import { createBlogPrismaDb } from "@/api/blog";
import { createPostPrismaDb } from "@/api/post";
import { createCommentPrismaDb } from "@/api/comment";

const prismaClient = new PrismaClient();

export const createPrismaDb = (): DB => {
    return {
        user: createUserPrismaDb(prismaClient),
        post: createPostPrismaDb(prismaClient),
        blog: createBlogPrismaDb(prismaClient),
        comment: createCommentPrismaDb(prismaClient),
    };
};

export const prisma = createPrismaDb();
