import { PrismaClient, Prisma } from '@prisma/client';
import { Blog, BlogDbInterface, BlogGetAllOptions, BlogUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

export const createBlogPrismaDb = (prisma: PrismaClient): BlogDbInterface => {
    return {
        getById: async (id: number): DbResult<Blog> => {
            const result = await prisma.blog.findUnique({ where: { id } });
            if (!result) return null
            const blog: Blog = { ...result, image: result.image ?? undefined };
            return blog;
        },

        getAll: async (options: BlogGetAllOptions): DbResult<Blog[]> => {
            const {
                page = 1,
                limit = 10,
                sort = 'createdAt',
                order = 'desc',
                search,
                authorId,
            } = options;

            const where: Prisma.BlogWhereInput = {
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } }
                    ]
                }),

                ...(authorId && {
                    authorId: authorId,
                }),
            };

            const result = await prisma.blog.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sort]: order,
                },
            });
            if (!result) return null;
            const blogs = result.map((res) => ({ ...res, image: res.image ?? undefined }));
            return blogs.length > 0 ? blogs : null;
        },

        create: async (
            authorId: Uuid,
            title: string,
            content: string,
            image?: string
        ): DbResult<Blog> => {
            const result = await prisma.blog.create({
                data: {
                    authorId,
                    title,
                    content,
                    image,
                },
            });
            if (!result) return null;
            const blog: Blog = { ...result, image: result.image ?? undefined };
            return blog;
        },

        update: async (id: number, data: BlogUpdateData): DbResult<Blog> => {
            const result = await prisma.blog.update({
                where: { id },
                data,
            });
            if (!result) return null;
            const blog: Blog = { ...result, image: result.image ?? undefined };
            return blog;
        },

        remove: async (id: number): DbResult<Blog> => {
            const result = await prisma.blog.delete({
                where: { id },
            });
            if (!result) return null;
            const blog: Blog = { ...result, image: result.image ?? undefined };
            return blog;
        },
    };
};

