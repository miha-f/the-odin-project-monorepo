import { PrismaClient, Prisma } from '@prisma/client';
import { Comment, CommentDbInterface, CommentGetAllOptions } from "..";
import { Uuid, DbResult } from "@/types";

// export const createCommentPrismaDb = (prisma: PrismaClient): CommentDbInterface => {
//     return {
//         getAll: async (postId: number, blogId: number, options: CommentGetAllOptions): DbResult<Comment[]> => {
//             const {
//                 page = 1,
//                 limit = 10,
//                 sort = 'createdAt',
//                 order = 'desc',
//                 search
//             } = options;
//
//             const where: Prisma.CommentWhereInput = search
//                 ? {
//                     OR: [
//                         { content: { contains: search, mode: 'insensitive' } },
//                     ],
//                     AND: [
//                         { blogId: blogId, postId: postId },
//                     ],
//                 }
//                 : { blogId: blogId, postId: postId };
//
//             const result = await prisma.comment.findMany({
//                 where,
//                 skip: (page - 1) * limit,
//                 take: limit,
//                 orderBy: {
//                     [sort]: order,
//                 },
//             });
//             if (!result) return null;
//             return result.length > 0 ? result : null;
//         },
//
//         getLatestCommentInPostInBlog: async (postId: number, blogId: number): DbResult<Comment> => {
//             const result = await prisma.comment.findFirst({
//                 where: { blogId, postId },
//                 orderBy: { id: 'desc' },
//             });
//             if (!result) return null
//             return result;
//         },
//
//         create: async (id: number, authorId: Uuid, postId: number, blogId: number, content: string): DbResult<Comment> => {
//             const result = await prisma.comment.create({
//                 data: {
//                     id,
//                     authorId,
//                     postId,
//                     blogId,
//                     content,
//                 },
//             });
//             if (!result) return null;
//             return result;
//         },
//
//     };
// };

export const createCommentPrismaDb = (prisma: PrismaClient): CommentDbInterface => {
    const buildDbFromClient = (client: PrismaClient): CommentDbInterface => ({
        getAll: async (postId: number, blogId: number, options: CommentGetAllOptions): DbResult<Comment[]> => {
            const {
                page = 1,
                limit = 10,
                sort = 'createdAt',
                order = 'desc',
                search
            } = options;

            const where: Prisma.CommentWhereInput = search
                ? {
                    OR: [
                        { content: { contains: search, mode: 'insensitive' } },
                    ],
                    AND: [
                        { blogId: blogId, postId: postId },
                    ],
                }
                : { blogId: blogId, postId: postId };

            const result = await prisma.comment.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sort]: order,
                },
            });
            if (!result) return null;
            return result.length > 0 ? result : null;
        },

        getLatestCommentInPostInBlog: async (postId: number, blogId: number): DbResult<Comment> => {
            const result = await prisma.comment.findFirst({
                where: { blogId, postId },
                orderBy: { id: 'desc' },
            });
            if (!result) return null
            return result;
        },

        create: async (id: number, authorId: Uuid, postId: number, blogId: number, content: string): DbResult<Comment> => {
            const result = await prisma.comment.create({
                data: {
                    id,
                    authorId,
                    postId,
                    blogId,
                    content,
                },
            });
            if (!result) return null;
            return result;
        },

        transaction: async <T>(callback: (tx: CommentDbInterface) => Promise<T>): Promise<T> => {
            return prisma.$transaction(async (txClient) => {
                const scopedDb = buildDbFromClient(txClient as PrismaClient);
                return await callback(scopedDb);
            });
        }
    });

    return buildDbFromClient(prisma);
};
