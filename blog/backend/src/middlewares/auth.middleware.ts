import passport from 'passport';
import { internalError, unauthorized } from "@/errors/errors";
import { handleAppError } from "@/utils/handleAppError";

// export const jwtAuth = passport.authenticate('jwt', { session: false });

// NOTE(miha): Debug jwtAuth middleware.
export const jwtAuth = (req, res, next) => {
    // console.log("Authorization Header:", req.headers["authorization"]);
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        // console.log("== Passport JWT Debug ==");
        // console.log("Error:", err);
        // console.log("User:", user);
        // console.log("Info:", info);

        if (err) {
            const { status, body } = handleAppError(internalError("JWT authentication failed", err));
            return res.status(status).json(body);
        }

        if (!user) {
            const appErr = unauthorized("Invalid or expired token, or user no longer exists");
            return res.status(401).json({ error: appErr });
        }

        req.user = user;
        next();
    })(req, res, next);
};
