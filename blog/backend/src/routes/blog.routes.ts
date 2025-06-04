import express from "express";
import { getDummyBlog } from "@/services/blog.service";

const router = express.Router();

router.get("/dummy", async (_req, res) => {
    const blog = await getDummyBlog();
    res.status(200).json(blog);
});
