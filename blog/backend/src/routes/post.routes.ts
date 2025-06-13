import express from "express";
import { createPostService } from "@/services/post.service";
import prismaDb from "@/db/prismaDb";
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

const postService = createPostService({ db: prismaDb });

// NOTE(miha): Get all posts for given blog.
router.get("/:blogId/posts", async (req, res) => {
    const blogId = Number(req.params.blogId);
    let [posts, err] = await postService.getAllByBlogId(blogId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: posts });
});

// NOTE(miha): Get specific post with postId (id) on given blog with blogId.
router.get("/:blogId/posts/:postId", async (req, res) => {
    const blogId = Number(req.params.blogId);
    const postId = Number(req.params.postId);
    let [post, err] = await postService.getByBlogIdAndPostId(blogId, postId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Create new post, {title: "", content: "", blogId: ""} are required.
router.post("/:blogId/posts", async (req, res) => {
    // TODO(miha): Need to put under auth route, so we can get: req.user
    const blogId = Number(req.params.blogId);
    let [post, err] = await postService.create();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

// NOTE(miha): Update post with postId (id), can pass empty body - no update.
router.patch("/:postId", async (req, res) => {
    // TODO(miha): Need to put under auth route, so we can get: req.user
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
    // TODO(miha): Need to put under auth route, so we can get: req.user
    const postId = Number(req.params.postId);
    let [post, err] = await postService.remove(postId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: post });
});

export default router;
