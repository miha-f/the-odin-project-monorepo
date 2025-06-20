import express, { Request, NextFunction, Response } from "express";
import cors from "cors";
import pinoHttp from 'pino-http';
import { logger } from "@/utils/logger";
import { createPassportStrategy } from "@/utils/auth";
import { DB } from "@/db/db"
import { errorMiddleware } from "./middlewares/error.middleware";
import { createBlogService, createUserService, createPostService, createCommentService, createAuthService } from "@/services";
import { createBlogRoutes, createUserRoutes, createPostRoutes, createCommentRoutes, createAuthRoutes } from "@/routes";
import { notFound } from "./errors";

const catchAllRoute = (req: Request, _res: Response, next: NextFunction) => {
    next(notFound("Page not found", req.url));
}

export const createApp = (db: DB, print = false) => {
    const app = express();

    app.use(cors({
        origin: "http://localhost:3006",
        credentials: true,
    }));
    app.use(express.json());

    const passport = createPassportStrategy(db);
    app.use(passport.initialize());

    if (print)
        app.use(pinoHttp({ logger }));
    if (!print)
        logger.level = 'silent';

    const blogService = createBlogService(db);
    const userService = createUserService(db);
    const postService = createPostService(db);
    const commentService = createCommentService(db);
    const authService = createAuthService(db);

    const blogRoutes = createBlogRoutes(blogService);
    const userRoutes = createUserRoutes(userService);
    const postRoutes = createPostRoutes(postService);
    const commentRoutes = createCommentRoutes(commentService);
    const authRoutes = createAuthRoutes(authService);

    app.use("/blogs", blogRoutes);
    app.use("/users", userRoutes);
    app.use("/blogs", postRoutes);
    app.use("/blogs", commentRoutes);
    app.use("/auth", authRoutes);


    app.use(catchAllRoute);

    // TODO(miha): Is it OK to ignore this? Func seems OK!
    // @ts-ignore
    app.use(errorMiddleware);

    return app;
}
