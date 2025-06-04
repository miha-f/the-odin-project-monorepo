import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
    res.status(200).json({ msg: "ok" });
});

router.post("/", async (_req, res) => {
    res.status(200).json({ msg: "ok" });
});

router.get("/:blogId", async (_req, res) => {
    res.status(200).json({ msg: "ok" });
});

router.patch("/:blogId", async (_req, res) => {
    res.status(200).json({ msg: "ok" });
});

router.delete("/:blogId", async (_req, res) => {
    res.status(200).json({ msg: "ok" });
});

// POST /blogs -> create new blog
// GET  /blogs -> get all blogs
// GET  /blogs/:id -> get specific blog
// PATCH /blogs/:id -> update specific blog (if we are the blog owner)
// DELETE /blogs/:id -> delete specific user (if we are the blog owner)

export default router;
