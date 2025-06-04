import { internalError, type AppError } from "@/errors/errors";

export async function tryCatch<T>(
    fn: () => Promise<T>
): Promise<[T | null, AppError | null]> {
    try {
        const data = await fn();
        return [data, null];
    } catch (e) {
        return [null, internalError("Unexpected error", e)];
    }
}
