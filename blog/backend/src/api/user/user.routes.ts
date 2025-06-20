import express from "express";
import { badRequest } from "@/errors";
import { Request, Response } from "express";
import { auth } from "@/middlewares/auth.middleware";
import { UserServiceInterface } from "./user.service";
import { asyncHandler } from "@/utils/asyncHandler";
import { userGetAllOptionsSchema, userIdPathSchema, userCreateSchema, userUpdateSchema } from "./user.schema";
import { UserGetAllOptions, UserUpdateData } from "./user.types";
import { success } from "@/utils/responses";

/*
    POST /users -> create new user
    GET  /users -> get all users
    GET  /users/:id -> get specific user
    PATCH /users/:id -> update specific user (if we are the same user)
    DELETE /users/:id -> delete specific user (if we are the same user)
    GET /users/:id/blogs -> get specific user blogs, if he has one
*/

export const createUserRoutes = (userService: UserServiceInterface) => {
    const router = express.Router();

    router.get("/",
        asyncHandler(async (req: Request, res: Response) => {
            const result = userGetAllOptionsSchema.safeParse(req.query);
            if (!result.success)
                throw badRequest("Invalid query", result.error);

            const options: UserGetAllOptions = result.data;

            const [users, err] = await userService.getAll(options);
            if (err)
                throw err;

            res.status(200).json(success(users));
        }));

    router.get("/:userId",
        asyncHandler(async (req, res) => {
            const result = userIdPathSchema.safeParse(req.params);
            if (!result.success)
                throw badRequest("Invalid path params", result.error);

            const { userId } = result.data;

            const [user, err] = await userService.getById(userId);
            if (err)
                throw err;

            res.status(200).json(success(user));
        }));

    router.post("/",
        asyncHandler(async (req, res) => {
            const result = userCreateSchema.safeParse(req.body);
            if (!result.success)
                throw badRequest("Invalid body", result.error);

            const { username, password } = result.data;

            // TODO(miha): Pass also passwordRepeat
            const [user, err] = await userService.create(username, password);
            if (err)
                throw err;

            res.status(201).json(success(user));
        }));

    router.patch("/:userId",
        auth,
        asyncHandler(async (req, res) => {
            const resultBody = userUpdateSchema.safeParse(req.body);
            if (!resultBody.success)
                throw badRequest("Invalid body", resultBody.error);

            const resultPath = userIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path params", resultPath.error);

            const { userId } = resultPath.data;
            const updateData: UserUpdateData = resultBody.data;

            const [user, err] = await userService.update(userId, updateData);
            if (err)
                throw err;

            return res.status(200).json(success(user));
        }));

    router.delete("/:userId",
        auth,
        asyncHandler(async (req, res) => {
            const resultPath = userIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path params", resultPath.error);

            const { userId } = resultPath.data;

            const [user, err] = await userService.remove(userId);
            if (err)
                throw err;

            return res.status(200).json(success(user));
        }));

    return router;
}
