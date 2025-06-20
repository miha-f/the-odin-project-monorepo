
import { z } from 'zod';

export const postGetAllOptionsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
});

export const postBlogIdPathSchema = z.object({
    blogId: z.coerce.number().int(),
});

export const postBlogIdPostIdPathSchema = z.object({
    blogId: z.coerce.number().int(),
    postId: z.coerce.number().int(),
});

export const postCreateSchema = z.object({
    // authorId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    image: z.array(z.string()).optional(),
});

export const postUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    images: z.array(z.string()).optional(),
});
