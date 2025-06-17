import express from "express";
import { handleAppError } from "@/utils/handleAppError";
import { jwtAuth } from "@/middlewares/auth.middleware";

/*
    POST /users -> create new user
    GET  /users -> get all users
    GET  /users/:id -> get specific user
    PATCH /users/:id -> update specific user (if we are the same user)
    DELETE /users/:id -> delete specific user (if we are the same user)
    GET /users/:id/blogs -> get specific user blogs, if he has one
*/

export const createUserRoutes = (userService) => {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        const [users, err] = await userService.getAll();
        if (err) {
            const { status, body } = handleAppError(err);
            return res.status(status).json(body);
        }
        res.status(200).json({ data: users });
    });

    router.get("/:userUuid", async (req, res) => {
        const userUuid = req.params.userUuid;
        const [user, err] = await userService.getById(userUuid);
        if (err) {
            const { status, body } = handleAppError(err);
            return res.status(status).json(body);
        }
        res.status(200).json({ data: user });
    });

    router.post("/", async (req, res) => {
        const { username, password } = req.body;
        const [user, err] = await userService.create(username, password);
        if (err) {
            const { status, body } = handleAppError(err);
            return res.status(status).json(body);
        }
        res.status(201).json({ data: user });
    });

    router.patch("/:userUuid", jwtAuth, async (req, res) => {
        const userUuid = req.params.userUuid;
        // if (userUuid !== req.user.uuid) console.log("can't delete other user stuff man");
        const [user, err] = await userService.update(userUuid, req.body);
        if (err) {
            const { status, body } = handleAppError(err);
            return res.status(status).json(body);
        }
        return res.status(200).json({ data: user });
    });

    router.delete("/:userUuid", jwtAuth, async (req, res) => {
        const userUuid = req.params.userUuid;
        const [user, err] = await userService.remove(userUuid);
        if (err) {
            const { status, body } = handleAppError(err);
            return res.status(status).json(body);
        }
        return res.status(200).json({ data: user });
    });

    return router;
}
