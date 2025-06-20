export type ErrorType = "NotFound" | "Conflict" | "BadRequest" | "Unauthorized" | "InternalError";

export type AppError = {
    type: ErrorType;
    message: string;
    cause?: unknown;
};

export const isAppError = (err: any): err is AppError => {
    return err && typeof err === "object" && "type" in err && "message" in err;
}

export const unauthorized = (message: string, cause?: unknown): AppError => ({ type: "Unauthorized", message, cause });
export const notFound = (message: string, cause?: unknown): AppError => ({ type: "NotFound", message, cause });
export const badRequest = (message: string, cause?: unknown): AppError => ({ type: "BadRequest", message, cause });
export const internalError = (message: string, cause?: unknown): AppError => ({ type: "InternalError", message, cause });
export const duplicateResource = (message: string, cause?: unknown): AppError => ({ type: "Conflict", message, cause });
