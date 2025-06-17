import express from "express";
import { handleAppError } from "@/utils/handleAppError";
import { jwtAuth } from '@/middlewares/auth.middleware';
import { unauthorized } from "@/errors/errors";

/*
    POST /auth/login -> login user
    // POST /auth/register -> register user -> we create/register user with POST /users
    POST /auth/logout -> logout user
    GET /auth/me -> get currently logged in user
*/

export const createAuthRoutes = (authService) => {
    const router = express.Router();

    // NOTE(miha): Get currentlly logged in user.
    // TODO(miha): Can we do better thatn Promise<any>?
    router.get("/me", jwtAuth, async (req, res): Promise<any> => {
        const user = req.user;
        // TODO(miha): Return error of our style
        if (!user) {
            const { status, body } = handleAppError(unauthorized("user not authorized"));
            return res.status(status).json(body);
        }

        return res.status(200).json({ data: user });
    });

    // NOTE(miha): Login user, {username: "", password: ""} are required.
    router.post("/login", async (req, res) => {
        const { username, password } = req.body;
        let [token, err] = await authService.login(username, password);
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: token });
    });

    // NOTE(miha): Logout currentlly logged in user.
    router.post("/logout", jwtAuth, async (req, res) => {
        let [post, err] = await authService.logout();
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: post });
    });

    return router;
}
