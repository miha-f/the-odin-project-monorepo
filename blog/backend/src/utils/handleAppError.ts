import { AppError } from "@/errors";

export function handleAppError(error: AppError): { status: number; message: string } {
    const status = getStatusFromType(error.type);
    const baseMessage = error.message;

    let causeMessage = "";
    if (error.cause) {
        if (typeof error.cause === "string") {
            causeMessage = ` Cause: ${error.cause}`;
        } else {
            try {
                causeMessage = ` Cause: ${JSON.stringify(error.cause)}`;
            } catch {
                causeMessage = ` Cause: [Unserializable object]`;
            }
        }
    }

    return {
        status,
        message: `[${error.type}]: ${baseMessage}, ${causeMessage}`,
    };
}

function getStatusFromType(type: AppError["type"]): number {
    switch (type) {
        case "NotFound":
            return 404;
        case "BadRequest":
            return 400;
        case "Unauthorized":
            return 401;
        // case "Forbidden":
        //     return 403;
        case "Conflict":
            return 409;
        // case "UnprocessableEntity":
        //     return 422;
        case "InternalError":
        default:
            return 500;
    }
}
