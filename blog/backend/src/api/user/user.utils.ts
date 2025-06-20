export function hidePassword<T extends { passwordHash?: string } | { passwordHash?: string }[] | null>(input: T): T {
    if (input === null || input === undefined) {
        return input as T;
    }

    if (Array.isArray(input)) {
        return input.map(user => ({
            ...user,
            passwordHash: "*****",
        })) as T;
    }

    return {
        ...input,
        passwordHash: "*****",
    } as T;
}
