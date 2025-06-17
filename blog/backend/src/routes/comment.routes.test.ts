import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { createApp } from "@/app";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import {
    createUserService,
    createBlogService,
    createPostService,
    createCommentService,
} from "@/services";
import { Blog, User, Post } from "@/models";

describe("commentHandler", () => {
    const db = mockDb;
    const app = createApp(db);
    const commentService = createCommentService({ db });
    const userService = createUserService({ db });
    const blogService = createBlogService({ db });
    const postService = createPostService({ db });

    let token: string;
    let user: User;
    let blog: Blog;
    let post: Post;
    let commentId: number;

    beforeAll(async () => {
        await seed(db, 1);

        const [blogs] = await blogService.getAll();
        blog = blogs[0];

        const [users] = await userService.getAll();
        user = users[0];

        const loginRes = await request(app)
            .post("/auth/login")
            .send({ username: user.username, password: "password" });
        token = loginRes.body.data;

        const [createdPost] = await postService.create(
            user.uuid,
            blog.id,
            "Post with comments",
            "Testing comments",
        );
        post = createdPost;

        const [createdComment] = await commentService.create(
            user.uuid,
            blog.id,
            post.id,
            "Initial comment",
        );
        commentId = createdComment.id;
    });

    describe("GET /blogs/:blogId/posts/:postId/comments", () => {
        it("returns all comments for a post", async () => {
            const res = await request(app)
                .get(`/blogs/${blog.id}/posts/${post.id}/comments`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data[res.body.data.length - 1].content).toBe("Initial comment");
        });

        it("returns an empty array if no comments exist", async () => {
            const [newPost] = await postService.create(
                user.uuid,
                blog.id,
                "No comments",
                "Testing no comments",
            );

            const res = await request(app)
                .get(`/blogs/${blog.id}/posts/${newPost.id}/comments`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toEqual([]);
        });
    });

    describe("POST /blogs/:blogId/posts/:postId/comments", () => {
        it("creates a comment with valid token", async () => {
            const res = await request(app)
                .post(`/blogs/${blog.id}/posts/${post.id}/comments`)
                .set("Authorization", `Bearer ${token}`)
                .send({ content: "New test comment" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.content).toBe("New test comment");
            expect(res.body.data.authorId).toBe(user.uuid);
        });

        it("fails to create comment without token", async () => {
            const res = await request(app)
                .post(`/blogs/${blog.id}/posts/${post.id}/comments`)
                .send({ content: "Should not work" });

            expect(res.statusCode).toBe(401);
        });

        it("fails with missing content", async () => {
            const res = await request(app)
                .post(`/blogs/${blog.id}/posts/${post.id}/comments`)
                .set("Authorization", `Bearer ${token}`)
                .send({});

            // You might want to validate and return 400 in your route
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });
    });
});
