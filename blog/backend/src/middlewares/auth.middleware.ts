import passport from 'passport';
import { internalError, unauthorized } from "@/errors";
import { Request, Response, NextFunction } from "express";
import { User } from "@/api/user";

// export const jwtAuth = passport.authenticate('jwt', { session: false });


// TODO(miha): Refactor all jwtAuth to auth
export const auth = (req: Request, res: Response, next: NextFunction) => {
    // console.log("Authorization Header:", req.headers["authorization"]);
    passport.authenticate(
        "jwt",
        { session: false },
        (err: any, user: User | false, _info: object | string | undefined) => {
            // console.log("== Passport JWT Debug ==");
            // console.log("Error:", err);
            // console.log("User:", user);
            // console.log("Info:", _info);
            if (err) throw internalError("JWT authentication failed", err);

            if (!user) {
                throw unauthorized("Invalid or expired token, or user no longer exists");
            }

            req.user = user;
            next();
        }
    )(req, res, next);
};

export const jwtAuth = auth;
