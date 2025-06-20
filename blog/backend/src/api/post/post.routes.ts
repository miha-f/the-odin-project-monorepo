import express from "express";
import { badRequest } from "@/errors";
import { auth } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { success } from "@/utils/responses";
import { User } from "@/api/user";
import { PostServiceInterface } from "./post.service";
import { PostGetAllOptions, PostUpdateData } from "./post.types";
import { postGetAllOptionsSchema, postBlogIdPathSchema, postBlogIdPostIdPathSchema, postCreateSchema, postUpdateSchema } from "./post.schema";

// TODO(miha): Is this something we would want to have under blog.routes.ts?
/*
    POST  /blogs/:id/posts -> create new post on specific blog (we need to be blog owner)
    GET  /blogs/:id/posts -> get all posts on specific blog
    GET  /blogs/:id/posts/:pid -> get specific post on specific blog
    PATCH  /blogs/:id/posts/:pid -> update specific post on specific blog (we need to be blog owner)
    DELETE  /blogs/:id/posts/:pid -> delete specific post on specific blog (we need to be blog owner)
*/

export const createPostRoutes = (postService: PostServiceInterface) => {
    const router = express.Router();

    // NOTE(miha): Get all posts for given blog.
    router.get("/:blogId/posts",
        asyncHandler(async (req, res) => {
            const resultQuery = postGetAllOptionsSchema.safeParse(req.query);
            if (!resultQuery.success)
                throw badRequest("Invalid query", resultQuery.error);

            const resultPath = postBlogIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path param", resultPath.error);

            const options: PostGetAllOptions = resultQuery.data;
            const { blogId } = resultPath.data;

            let [posts, err] = await postService.getAllByBlogId(blogId, options);
            if (err)
                throw err;

            res.status(200).json(success(posts));
        }));

    // NOTE(miha): Get specific post with postId (id) on given blog with blogId.
    router.get("/:blogId/posts/:postId",
        asyncHandler(async (req, res) => {
            const result = postBlogIdPostIdPathSchema.safeParse(req.params);
            if (!result.success)
                throw badRequest("Invalid path params", result.error);

            const { blogId, postId } = result.data;

            let [post, err] = await postService.getByIdAndBlogId(postId, blogId);
            if (err)
                throw err;

            res.status(200).json(success(post));
        }));

    // NOTE(miha): Create new post, {title: "", content: "", blogId: ""} are required.
    router.post("/:blogId/posts",
        auth,
        asyncHandler(async (req, res) => {
            const resultPath = postBlogIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path param", resultPath.error);

            const resultBody = postCreateSchema.safeParse(req.body);
            if (!resultBody.success)
                throw badRequest("Invalid body", resultBody.error);

            const { title, content, image } = resultBody.data;
            const user = req.user as User;
            const { blogId } = resultPath.data;

            let [post, err] = await postService.create(user.uuid, blogId, title, content);
            if (err)
                throw err;

            res.status(200).json(success(post));
        }));

    // NOTE(miha): Update post with postId (id), can pass empty body - no update.
    router.patch("/:blogId/posts/:postId",
        auth,
        asyncHandler(async (req, res) => {
            const result = postBlogIdPostIdPathSchema.safeParse(req.params);
            if (!result.success)
                throw badRequest("Invalid path params", result.error);

            const resultBody = postUpdateSchema.safeParse(req.body);
            if (!resultBody.success)
                throw badRequest("Invalid body", resultBody.error);

            const { blogId, postId } = result.data;
            const user = req.user as User;
            const updateData: PostUpdateData = resultBody.data;

            let [post, err] = await postService.update(postId, blogId, updateData);
            if (err)
                throw err;

            res.status(200).json(success(post));
        }));

    // NOTE(miha): Remove post with postId (id).
    router.delete("/:blogId/posts/:postId",
        auth,
        asyncHandler(async (req, res) => {
            const result = postBlogIdPostIdPathSchema.safeParse(req.params);
            if (!result.success)
                throw badRequest("Invalid path params", result.error);

            const { blogId, postId } = result.data;
            const user = req.user as User;

            let [post, err] = await postService.remove(postId, blogId);
            if (err)
                throw err;

            res.status(200).json(success(post));
        }));

    return router;
}
