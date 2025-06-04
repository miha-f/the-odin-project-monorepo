export async function tryCatch<T>(
    fn: () => Promise<T>
): Promise<[T | null, Error | null]> {
    try {
        const data = await fn();
        return [data, null];
    } catch (e) {
        if (e instanceof Error)
            return [null, e];
        return [null, new Error(String(e))];
    }
}
