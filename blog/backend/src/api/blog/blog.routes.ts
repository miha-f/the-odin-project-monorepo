import express from "express";
import { badRequest } from "@/errors";
import { BlogServiceInterface } from "./blog.service";
import { auth } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import { blogGetAllOptionsSchema, blogIdPathSchema, blogCreateSchema, blogUpdateSchema } from "./blog.schema";
import { BlogGetAllOptions, BlogUpdateData } from "./blog.types";
import { success } from "@/utils/responses";
import { User } from "@/api/user";

export const createBlogRoutes = (blogService: BlogServiceInterface) => {
    const router = express.Router();

    // NOTE(miha): Get all blogs.
    router.get("/",
        asyncHandler(async (req: Request, res: Response) => {
            const result = blogGetAllOptionsSchema.safeParse(req.query);
            if (!result.success)
                throw badRequest("Invalid query", result.error);

            const options: BlogGetAllOptions = result.data;

            let [blogs, err] = await blogService.getAll(options);
            if (err)
                throw err;

            res.status(200).json(success(blogs));
        }));

    // NOTE(miha): Get specific blog with blogId (number).
    router.get("/:blogId",
        asyncHandler(async (req, res) => {
            const result = blogIdPathSchema.safeParse(req.params);
            if (!result.success)
                throw badRequest("Invalid path param", result.error);

            const { blogId } = result.data;

            let [blog, err] = await blogService.getById(blogId);
            if (err)
                throw err;

            res.status(200).json(success(blog));
        }));

    // NOTE(miha): Create new blog, {title: "", content: ""} are required.
    router.post("/",
        auth,
        asyncHandler(async (req, res) => {
            const result = blogCreateSchema.safeParse(req.body);
            if (!result.success)
                throw badRequest("Invalid body", result.error);

            const { title, content, image } = result.data;
            const user = req.user as User;

            let [blog, err] = await blogService.create(user.uuid, title, content, image);
            if (err)
                throw err;

            res.status(200).json(success(blog));
        }));

    // NOTE(miha): Update blog with blogId (number), can pass empty body - no update.
    router.patch("/:blogId",
        auth,
        asyncHandler(async (req, res) => {
            const resultBody = blogUpdateSchema.safeParse(req.body);
            if (!resultBody.success)
                throw badRequest("Invalid body", resultBody.error);

            const resultPath = blogIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path params", resultPath.error);

            const { blogId } = resultPath.data;
            const updateData: BlogUpdateData = resultBody.data;

            let [blog, err] = await blogService.update(blogId, updateData);
            if (err)
                throw err;

            res.status(200).json(success(blog));
        }));

    // NOTE(miha): Remove blog with blogId (number).
    router.delete("/:blogId",
        auth,
        asyncHandler(async (req, res) => {
            const resultPath = blogIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path params", resultPath.error);

            const { blogId } = resultPath.data;

            let [blog, err] = await blogService.remove(blogId);
            if (err)
                throw err;

            res.status(200).json(success(blog));
        }));

    return router;
}

