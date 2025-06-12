import express from "express";
import { createPostService } from "@/services/post.service";
import mockDb from "@/db/mockDb";
import { handleAppError } from "@/utils/handleAppError";

// TODO(miha): Is this something we would want to have under blog.routes.ts?
/*
    POST  /blogs/:id/posts -> create new post on specific blog (we need to be blog owner)
    GET  /blogs/:id/posts -> get all posts on specific blog
    GET  /blogs/:id/posts/:pid -> get specific post on specific blog
    PATCH  /blogs/:id/posts/:pid -> update specific post on specific blog (we need to be blog owner)
    DELETE  /blogs/:id/posts/:pid -> delete specific post on specific blog (we need to be blog owner)
*/

const router = express.Router();

const postService = createPostService({ db: mockDb });

// NOTE(miha): Get all posts.
router.get("/", async (_req, res) => {
    let [posts, err] = await postService.getAll();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: posts });
});

// NOTE(miha): Get specific post with postId (id).
router.get("/:postId", async (req, res) => {
    const postId = Number(req.params.postId);
    let [post, err] = await postService.getById(postId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Create new post, {title: "", content: "", blogId: ""} are required.
router.post("/", async (req, res) => {
    let [post, err] = await postService.create(req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Update post with postId (id), can pass empty body - no update.
router.patch("/:postId", async (req, res) => {
    const postId = Number(req.params.postId);
    let [post, err] = await postService.update(postId, req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Remove post with postId (id).
router.delete("/:postId", async (req, res) => {
    const postId = Number(req.params.postId);
    let [post, err] = await postService.remove(postId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

export default router;
