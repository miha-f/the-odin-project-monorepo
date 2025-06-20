import { Request, Response, NextFunction } from "express";

// export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// };

export const asyncHandler =
    (
        fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
    ) =>
        (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

