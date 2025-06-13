import express from "express";
import { createBlogService } from "@/services/blog.service";
import prismaDb from "@/db/prismaDb";
import { handleAppError } from "@/utils/handleAppError";

const router = express.Router();

const blogService = createBlogService({ db: prismaDb });

// NOTE(miha): Get all blogs.
router.get("/", async (_req, res) => {
    let [blogs, err] = await blogService.getAll();
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: blogs });
});

// NOTE(miha): Get specific blog with blogId (number).
router.get("/:blogId", async (req, res) => {
    const blogId = Number(req.params.blogId);
    let [blog, err] = await blogService.getById(blogId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: blog });
});

// NOTE(miha): Create new blog, {title: "", content: ""} are required.
router.post("/", async (req, res) => {
    // TODO(miha): Need to put under auth route, so we can get: req.user
    let [blog, err] = await blogService.create(req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: blog });
});

// NOTE(miha): Update blog with blogId (number), can pass empty body - no update.
router.patch("/:blogId", async (req, res) => {
    // TODO(miha): Need to put under auth route, so we can get: req.user
    const blogId = Number(req.params.blogId);
    let [blog, err] = await blogService.update(blogId, req.body);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: blog });
});

// NOTE(miha): Remove blog with blogId (number).
router.delete("/:blogId", async (req, res) => {
    // TODO(miha): Need to put under auth route, so we can get: req.user
    const blogId = Number(req.params.blogId);
    let [blog, err] = await blogService.remove(blogId);
    if (err) {
        const { status, body } = handleAppError(err);
        res.status(status).json(body);
    }
    res.status(200).json({ data: blog });
});

export default router;
