import express from "express";
import { createCommentService } from "@/services/comment.service";
import mockDb from "@/db/mockDb";
import { handleAppError } from "@/utils/handleAppError";

/*
    POST /posts/:pid/comments -> create new comment for specific blog on specific post
    GET  /posts/:pid/comments -> get all comments for specific blog on specific post
*/

const router = express.Router();

const commentService = createCommentService({ db: mockDb });

// NOTE(miha): Get all posts.
router.get("/:postId/comments", async (req, res) => {
    // TODO(miha): Need to pass postId to service
    const postId = Number(req.params.postId);
    let [posts, err] = await commentService.getAll(postId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: posts });
});

// NOTE(miha): Create new comment under post with postId (number), {} 
router.post("/:postId/comments", async (req, res) => {
    // TODO(miha): Need to pass postId to service
    const postId = Number(req.params.postId);
    let [post, err] = await commentService.create(postId, req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

export default router;
