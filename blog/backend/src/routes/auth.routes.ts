import express from "express";
import { createAuthService } from "@/services/auth.service";
import mockDb from "@/db/mockDb";
import { handleAppError } from "@/utils/handleAppError";

/*
    POST /auth/login -> login user
    // POST /auth/register -> register user -> we create/register user with POST /users
    POST /auth/logout -> logout user
    GET /auth/me -> get currently logged in user
*/

const router = express.Router();

const authService = createAuthService({ db: mockDb });

// NOTE(miha): Get currentlly logged in user.
router.get("/me", async (_req, res) => {
    let [user, err] = await authService.getCurrentUser();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: user });
});

// NOTE(miha): Login user, {username: "", password: ""} are required.
router.post("/login", async (req, res) => {
    let [post, err] = await authService.login(req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Logout currentlly logged in user.
router.post("/logout", async (req, res) => {
    let [post, err] = await authService.logout();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

export default router;
