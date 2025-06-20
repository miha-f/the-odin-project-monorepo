import { PrismaClient, Prisma } from '@prisma/client';
import { Post, PostDbInterface, PostGetAllOptions, PostUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

// export const createPostPrismaDb = (prisma: PrismaClient): PostDbInterface => {
//     return {
//         getByIdAndBlogId: async (id: number, blogId: number): DbResult<Post> => {
//             const result = await prisma.post.findUnique({ where: { id_blogId: { id: id, blogId: blogId }, } });
//             if (!result) return null
//             const post: Post = { ...result, images: result.images ?? undefined };
//             return post;
//         },
//
//         getAll: async (options: PostGetAllOptions): DbResult<Post[]> => {
//             const {
//                 page = 1,
//                 limit = 10,
//                 sort = 'createdAt',
//                 order = 'desc',
//                 search
//             } = options;
//
//             const where: Prisma.PostWhereInput = search
//                 ? {
//                     OR: [
//                         { title: { contains: search, mode: 'insensitive' } },
//                         { content: { contains: search, mode: 'insensitive' } }
//                     ]
//                 }
//                 : {};
//
//             const result = await prisma.post.findMany({
//                 where,
//                 skip: (page - 1) * limit,
//                 take: limit,
//                 orderBy: {
//                     [sort]: order,
//                 },
//             });
//             if (!result) return null;
//             const posts = result.map((res) => ({ ...res, images: res.images ?? undefined }));
//             return posts.length > 0 ? posts : null;
//         },
//
//         getAllByBlogId: async (blogId: number, options: PostGetAllOptions): DbResult<Post[]> => {
//             const {
//                 page = 1,
//                 limit = 10,
//                 sort = 'createdAt',
//                 order = 'desc',
//                 search
//             } = options;
//
//             const where: Prisma.PostWhereInput = search
//                 ? {
//                     OR: [
//                         { title: { contains: search, mode: 'insensitive' } },
//                         { content: { contains: search, mode: 'insensitive' } },
//                         { blogId: blogId },
//                     ]
//                 }
//                 : { blogId: blogId };
//
//             const result = await prisma.post.findMany({
//                 where,
//                 skip: (page - 1) * limit,
//                 take: limit,
//                 orderBy: {
//                     [sort]: order,
//                 },
//             });
//             if (!result) return null;
//             const posts = result.map((res) => ({ ...res, images: res.images ?? undefined }));
//             return posts.length > 0 ? posts : null;
//         },
//
//         getLatestPostInBlog: async (blogId: number): DbResult<Post> => {
//             const result = await prisma.post.findFirst({
//                 where: { blogId },
//                 orderBy: { id: 'desc' },
//             });
//             if (!result) return null
//             const post: Post = { ...result, images: result.images ?? undefined };
//             return post;
//         },
//
//         create: async (id: number, authorId: Uuid, blogId: number, title: string, content: string, images?: string[]): DbResult<Post> => {
//             const result = await prisma.post.create({
//                 data: {
//                     id,
//                     authorId,
//                     blogId,
//                     title,
//                     content,
//                     images,
//                 },
//             });
//             if (!result) return null;
//             const post: Post = { ...result, images: result.images ?? undefined };
//             return post;
//         },
//
//         update: async (id: number, blogId: number, data: PostUpdateData): DbResult<Post> => {
//             const result = await prisma.post.update({
//                 where: { id_blogId: { id, blogId } },
//                 data,
//             });
//             if (!result) return null;
//             const post: Post = { ...result, images: result.images ?? undefined };
//             return post;
//         },
//
//         remove: async (id: number, blogId: number): DbResult<Post> => {
//             const result = await prisma.post.delete({
//                 where: { id_blogId: { id, blogId } },
//             });
//             if (!result) return null;
//             const post: Post = { ...result, images: result.images ?? undefined };
//             return post;
//         },
//     };
// };

export const createPostPrismaDb = (prisma: PrismaClient): PostDbInterface => {
    const buildDbFromClient = (client: PrismaClient): PostDbInterface => ({
        getByIdAndBlogId: async (id: number, blogId: number): DbResult<Post> => {
            const result = await client.post.findUnique({ where: { id_blogId: { id, blogId } } });
            return result ? { ...result, images: result.images ?? undefined } : null;
        },

        getAll: async (options: PostGetAllOptions): DbResult<Post[]> => {
            const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search } = options;

            const where: Prisma.PostWhereInput = search
                ? {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                    ]
                }
                : {};

            const result = await client.post.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sort]: order },
            });

            const posts = result.map(r => ({ ...r, images: r.images ?? undefined }));
            return posts.length > 0 ? posts : null;
        },

        getAllByBlogId: async (blogId: number, options: PostGetAllOptions): DbResult<Post[]> => {
            const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', search } = options;

            const where: Prisma.PostWhereInput = search
                ? {
                    blogId,
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                    ]
                }
                : { blogId };

            const result = await client.post.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { [sort]: order },
            });

            const posts = result.map(r => ({ ...r, images: r.images ?? undefined }));
            return posts.length > 0 ? posts : null;
        },

        getLatestPostInBlog: async (blogId: number): DbResult<Post> => {
            const result = await client.post.findFirst({
                where: { blogId },
                orderBy: { id: 'desc' },
            });
            return result ? { ...result, images: result.images ?? undefined } : null;
        },

        create: async (id: number, authorId: Uuid, blogId: number, title: string, content: string, images?: string[]): DbResult<Post> => {
            const result = await client.post.create({
                data: { id, authorId, blogId, title, content, images },
            });
            return result ? { ...result, images: result.images ?? undefined } : null;
        },

        update: async (id: number, blogId: number, data: PostUpdateData): DbResult<Post> => {
            const result = await client.post.update({
                where: { id_blogId: { id, blogId } },
                data,
            });
            return result ? { ...result, images: result.images ?? undefined } : null;
        },

        remove: async (id: number, blogId: number): DbResult<Post> => {
            const result = await client.post.delete({
                where: { id_blogId: { id, blogId } },
            });
            return result ? { ...result, images: result.images ?? undefined } : null;
        },

        transaction: async <T>(callback: (tx: PostDbInterface) => Promise<T>): Promise<T> => {
            return prisma.$transaction(async (txClient) => {
                const scopedDb = buildDbFromClient(txClient as PrismaClient);
                return await callback(scopedDb);
            });
        }
    });

    return buildDbFromClient(prisma);
};
