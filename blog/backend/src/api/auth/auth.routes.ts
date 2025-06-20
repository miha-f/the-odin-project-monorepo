import express from "express";
import { handleAppError } from "@/utils/handleAppError";
import { asyncHandler } from "@/utils/asyncHandler";
import { auth } from '@/middlewares/auth.middleware';
import { success } from "@/utils/responses";
import { badRequest, unauthorized } from "@/errors";
import { AuthServiceInterface } from "./auth.service";
import { authCreateSchema } from "./auth.schema";

/*
    POST /auth/login -> login user
    // POST /auth/register -> register user -> we create/register user with POST /users
    POST /auth/logout -> logout user
    GET /auth/me -> get currently logged in user
*/

export const createAuthRoutes = (authService: AuthServiceInterface) => {
    const router = express.Router();

    // NOTE(miha): Get currentlly logged in user.
    // TODO(miha): Can we do better thatn Promise<any>?
    router.get("/me",
        auth,
        asyncHandler(async (req, res): Promise<any> => {
            const user = req.user;
            return res.status(200).json(success(user));
        }));

    // NOTE(miha): Login user, {username: "", password: ""} are required.
    router.post("/login",
        asyncHandler(async (req, res) => {
            const result = authCreateSchema.safeParse(req.body);
            if (!result.success)
                throw badRequest("Invalid body", result.error);

            const { username, password } = result.data;

            let [token, err] = await authService.login(username, password);
            if (err)
                throw err;

            res.status(200).json(success(token));
        }));

    // NOTE(miha): Logout currentlly logged in user.
    // NOTE(miha): We don't have any mechanisem to logout user. This is all done
    // on the frontend - we just delete token from local storage.
    // router.post("/logout",
    //     auth,
    //     asyncHandler(async (_req, res) => {
    //         let [post, err] = await authService.logout();
    //         if (err) {
    //             const { status, body } = handleAppError(err);
    //             res.status(status).json(body);
    //         }
    //         res.status(200).json({ data: post });
    //     }));

    return router;
}
