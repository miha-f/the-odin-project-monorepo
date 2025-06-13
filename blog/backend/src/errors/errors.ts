export type ErrorType = "NotFound" | "Conflict" | "BadRequest" | "Unauthorized" | "InternalError";

export type AppError = {
    type: ErrorType;
    message: string;
    cause?: unknown;
};

export const unauthorized = (message: string): AppError => ({ type: "Unauthorized", message });
export const notFound = (message: string): AppError => ({ type: "NotFound", message });
export const badRequest = (message: string): AppError => ({ type: "BadRequest", message });
export const internalError = (message: string, cause?: unknown): AppError => ({
    type: "InternalError",
    message,
    cause,
});
export const duplicateResource = (message: string): AppError => ({ type: "Conflict", message });
