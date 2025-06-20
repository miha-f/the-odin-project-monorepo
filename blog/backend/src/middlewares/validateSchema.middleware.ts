import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { badRequest } from "@/errors";

export const validate =
    <T>(schema: ZodSchema<T>, source: "body" | "params" | "query") =>
        (req: Request, _res: Response, next: NextFunction) => {
            const result = schema.safeParse(req[source]);
            if (!result.success)
                throw badRequest("Invalid request", result.error);

            (req as any)[source] = result.data;
            next();
        };
