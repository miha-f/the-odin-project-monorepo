import { z } from "zod";

export const authCreateSchema = z.object({
    // authorId: z.string().uuid(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});
