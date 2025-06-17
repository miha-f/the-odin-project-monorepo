import express from "express";
import { handleAppError } from "@/utils/handleAppError";
import { unauthorized } from "@/errors/errors";
import { jwtAuth } from "@/middlewares/auth.middleware";

export const createBlogRoutes = (blogService) => {
    const router = express.Router();

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
    router.post("/", jwtAuth, async (req, res) => {
        const user = req.user!;
        const { title, content, image } = req.body
        let [blog, err] = await blogService.create(user.uuid, title, content, image);
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: blog });
    });

    // NOTE(miha): Update blog with blogId (number), can pass empty body - no update.
    router.patch("/:blogId", jwtAuth, async (req, res) => {
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
    router.delete("/:blogId", jwtAuth, async (req, res) => {
        // TODO(miha): Need to put under auth route, so we can get: req.user
        const blogId = Number(req.params.blogId);
        let [blog, err] = await blogService.remove(blogId);
        if (err) {
            const { status, body } = handleAppError(err);
            res.status(status).json(body);
        }
        res.status(200).json({ data: blog });
    });

    return router;
}

