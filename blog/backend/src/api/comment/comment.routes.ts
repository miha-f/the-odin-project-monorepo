import express from "express";
import { badRequest } from "@/errors";
import { asyncHandler } from "@/utils/asyncHandler";
import { handleAppError } from "@/utils/handleAppError";
import { auth } from "@/middlewares/auth.middleware";
import { CommentServiceInterface } from "./comment.service";
import { commentGetAllOptionsSchema, commentBlogIdPostIdPathSchema, commentCreateSchema } from "./comment.schema";
import { CommentGetAllOptions } from "./comment.types";
import { success } from "@/utils/responses";
import { User } from "@/api/user";

/*
    POST /posts/:pid/comments -> create new comment for specific blog on specific post
    GET  /posts/:pid/comments -> get all comments for specific blog on specific post
*/

export const createCommentRoutes = (commentService: CommentServiceInterface) => {
    const router = express.Router();

    // NOTE(miha): Get all posts.
    router.get("/:blogId/posts/:postId/comments",
        asyncHandler(async (req, res) => {
            const resultPath = commentBlogIdPostIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path param", resultPath.error);

            const result = commentGetAllOptionsSchema.safeParse(req.query);
            if (!result.success)
                throw badRequest("Invalid query", result.error);

            const options: CommentGetAllOptions = result.data;
            const { blogId, postId } = resultPath.data;

            let [posts, err] = await commentService.getAll(blogId, postId, options);
            if (err && err.type !== 'NotFound')
                throw err;

            return res.status(200).json(success(posts));
        }));

    // NOTE(miha): Create new comment under post with postId (number), {} 
    router.post("/:blogId/posts/:postId/comments",
        auth,
        asyncHandler(async (req, res) => {
            const resultPath = commentBlogIdPostIdPathSchema.safeParse(req.params);
            if (!resultPath.success)
                throw badRequest("Invalid path param", resultPath.error);

            const result = commentCreateSchema.safeParse(req.body);
            if (!result.success)
                throw badRequest("Invalid query", result.error);

            const { content } = result.data;
            const { blogId, postId } = resultPath.data;
            const user = req.user as User;

            let [post, err] = await commentService.create(user.uuid, blogId, postId, content);
            if (err)
                throw err;

            res.status(200).json(success(post));
        }));

    return router;
}
