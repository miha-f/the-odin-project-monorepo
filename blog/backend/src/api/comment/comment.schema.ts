import { z } from 'zod';

export const commentGetAllOptionsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['createdAt', 'updatedAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
});

export const commentBlogIdPostIdPathSchema = z.object({
    blogId: z.coerce.number().int(),
    postId: z.coerce.number().int(),
});

export const commentCreateSchema = z.object({
    // authorId: z.string().uuid(),
    //title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    //image: z.array(z.string()).optional(),
});
