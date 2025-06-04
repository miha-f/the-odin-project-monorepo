import { AppError } from "@/errors/errors";

export function handleAppError(error: AppError) {
    switch (error.type) {
        case "NotFound":
            return { status: 404, body: { error: error.message } };
        case "Conflict":
            return { status: 409, body: { error: error.message } };
        case "BadRequest":
            return { status: 400, body: { error: error.message } };
        case "Unauthorized":
            return { status: 401, body: { error: error.message } };
        case "InternalError":
        default:
            return { status: 500, body: { error: error.message } };
    }
}
