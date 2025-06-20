import { Request, Response, NextFunction } from "express";
import { handleAppError } from "@/utils/handleAppError";
import { failure } from "@/utils/responses";
import { isAppError } from "@/errors";
import { logger } from "@/utils/logger";

export function errorMiddleware(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction) {
    if (isAppError(err)) {
        const { status, message } = handleAppError(err);

        logger.error("== AppError Caught ==");
        logger.error("Status: " + status);
        logger.error("Type: " + err.type);
        logger.error("Message: " + message);

        return res.status(status).json(failure(message));
    }

    logger.error("== Unknown Error Caught ==", err);
    return res.status(500).json(failure("An unexpected error occurred"));
}
