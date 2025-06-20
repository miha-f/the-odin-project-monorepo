import { z } from 'zod';

export const userGetAllOptionsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['createdAt', 'updatedAt', 'username']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
});

export const userIdPathSchema = z.object({
    userId: z.string().uuid(),
});

export const userCreateSchema = z.object({
    // authorId: z.string().uuid(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    passwordRepeat: z.string().min(1, "Password is required"),
});

export const userUpdateSchema = z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    passwordRepeat: z.string().optional(),
});
