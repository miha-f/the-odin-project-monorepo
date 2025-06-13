import express from "express";
import { createUserService } from "@/services/user.service";
import prismaDb from "@/db/prismaDb";
import { handleAppError } from "@/utils/handleAppError";

/*
    POST /users -> create new user
    GET  /users -> get all users
    GET  /users/:id -> get specific user
    PATCH /users/:id -> update specific user (if we are the same user)
    DELETE /users/:id -> delete specific user (if we are the same user)
    GET /users/:id/blogs -> get specific user blogs, if he has one
*/

const router = express.Router();

const userService = createUserService({ db: prismaDb });

// NOTE(miha): Get all users.
router.get("/", async (_req, res) => {
    let [users, err] = await userService.getAll();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: users });
});

// NOTE(miha): Get specific user with userUuid (uuid).
router.get("/:userUuid", async (req, res) => {
    const userUuid = req.params.userUuid;
    let [user, err] = await userService.getById(userUuid);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: user });
});

// TODO(miha): Create this route: GET /users/:id/blogs -> get specific user blogs, if he has one

// NOTE(miha): Create new user, {username: "", password: "", passwordRepeat: ""} are required.
router.post("/", async (req, res) => {
    let [user, err] = await userService.create(req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: user });
});

// NOTE(miha): Update user with userUuid (uuid), can pass empty body - no update.
router.patch("/:userUuid", async (req, res) => {
    const userUuid = req.params.userUuid;
    let [user, err] = await userService.update(userUuid, req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: user });
});

// NOTE(miha): Remove user with userUuid (uuid).
router.delete("/:userUuid", async (req, res) => {
    const userUuid = req.params.userUuid;
    let [user, err] = await userService.remove(userUuid);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: user });
});

export default router;
