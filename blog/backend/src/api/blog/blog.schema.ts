import { z } from 'zod';

export const blogGetAllOptionsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
    authorId: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
});

export const blogIdPathSchema = z.object({
    blogId: z.coerce.number().int(),
});

export const blogCreateSchema = z.object({
    // authorId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    image: z.string().optional(),
});

export const blogUpdateSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    image: z.string().url().optional(),
});
