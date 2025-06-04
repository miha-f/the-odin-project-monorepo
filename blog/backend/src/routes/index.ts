import express from "express";
import blogRoutes from "./blog.routes";

const router = express.Router();

router.use("/blogs", blogRoutes);

export default router;
