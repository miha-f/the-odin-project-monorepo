import express from "express";
import { createCommentService } from "@/services/comment.service";
import prismaDb from "@/db/prismaDb";
import { handleAppError } from "@/utils/handleAppError";

/*
    POST /posts/:pid/comments -> create new comment for specific blog on specific post
    GET  /posts/:pid/comments -> get all comments for specific blog on specific post
*/

const router = express.Router();

const commentService = createCommentService({ db: prismaDb });

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
router.post("/:blogId/posts/:postId/comments", async (req, res) => {
    // TODO(miha): User must be auth
    const blogId = Number(req.params.postId);
    const postId = Number(req.params.postId);
    const authorId = "";
    let [post, err] = await commentService.create(authorId, blogId, postId, req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

export default router;
