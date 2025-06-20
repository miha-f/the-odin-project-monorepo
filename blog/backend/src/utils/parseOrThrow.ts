import { badRequest } from "@/errors";
import { ZodSchema } from "zod";

export function parseOrThrow<T>(schema: ZodSchema<T>, input: unknown): T {
    const result = schema.safeParse(input);
    if (!result.success) {
        throw badRequest("Invalid input", result.error);
    }
    return result.data;
}
