import express from "express";
import blogRoutes from "./blog.routes";
import postRoutes from "./post.routes";
import commentRoutes from "./comment.routes";
import userRoutes from "./user.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/blogs", blogRoutes);
router.use("/blogs", postRoutes);
router.use("/blogs", commentRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
