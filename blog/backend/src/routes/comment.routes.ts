import express from "express";
import { handleAppError } from "@/utils/handleAppError";
import { jwtAuth } from "@/middlewares/auth.middleware";

/*
    POST /posts/:pid/comments -> create new comment for specific blog on specific post
    GET  /posts/:pid/comments -> get all comments for specific blog on specific post
*/

export const createCommentRoutes = (commentService) => {
    const router = express.Router();

    // NOTE(miha): Get all posts.
    router.get("/:blogId/posts/:postId/comments", async (req, res) => {
        const blogId = Number(req.params.blogId);
        const postId = Number(req.params.postId);
        let [posts, err] = await commentService.getAll(blogId, postId);
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: posts });
    });

    // NOTE(miha): Create new comment under post with postId (number), {} 
    router.post("/:blogId/posts/:postId/comments", jwtAuth, async (req, res) => {
        const blogId = Number(req.params.blogId);
        const postId = Number(req.params.postId);
        const user = req.user;
        let [post, err] = await commentService.create(user.uuid, blogId, postId, req.body.content);
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: post });
    });

    return router;
}
