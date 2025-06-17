import express from "express";
import cors from "cors";
import pinoHttp from 'pino-http';
import { logger } from "@/utils/logger";
import { createPassportStrategy } from "@/utils/auth";

import {
    createUserService,
    createBlogService,
    createPostService,
    createCommentService,
    createAuthService,
} from "@/services";
import {
    createUserRoutes,
    createBlogRoutes,
    createPostRoutes,
    createCommentRoutes,
    createAuthRoutes,
} from "@/routes";
import { DB } from "@/db/db"

export const createApp = (db: DB, print = false) => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const passport = createPassportStrategy(db);
    app.use(passport.initialize());

    if (print)
        app.use(pinoHttp({ logger }));

    const userService = createUserService({ db: db });
    const blogService = createBlogService({ db: db });
    const postService = createPostService({ db: db });
    const commentService = createCommentService({ db: db });
    const authService = createAuthService({ db: db });

    const userRoutes = createUserRoutes(userService);
    const blogRoutes = createBlogRoutes(blogService);
    const postRoutes = createPostRoutes(postService);
    const commentRoutes = createCommentRoutes(commentService);
    const authRoutes = createAuthRoutes(authService);

    app.use("/blogs", blogRoutes);
    app.use("/blogs", postRoutes);
    app.use("/blogs", commentRoutes);
    app.use("/users", userRoutes);
    app.use("/auth", authRoutes);

    return app;
}
