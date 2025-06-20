import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { createApp } from "@/app";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { createPostService, createUserService, createBlogService } from "@/services";
import { Blog } from "@/api/blog";
import { User } from "@/api/user";

describe("postHandler", () => {
    const db = mockDb;
    const app = createApp(db);
    const BASE_URL = "/blogs"
    const postService = createPostService(db);
    const blogService = createBlogService(db);
    const userService = createUserService(db);

    let token: string;
    let blog: Blog;
    let postId: number;
    let user: User;

    beforeAll(async () => {
        await seed(db, 1);

        const [blogs, blogErr] = await blogService.getAll({ page: 1, limit: 100 });
        if (!blogs || blogErr) throw new Error("Failed to seed blogs");
        blog = blogs[0];

        const [users] = await userService.getAll({ page: 1, limit: 100 });
        if (!users || !users[0]) throw new Error("Users must return one result");
        user = users[0];
        const loginRes = await request(app)
            .post("/auth/login")
            .send({ username: users[0].username, password: "password" });
        token = loginRes.body.data;
        if (!token) throw new Error("Login failed; token not received");

        const [createdPost, postErr] = await postService.create(
            users[0].uuid,
            blog.id,
            "Initial Post",
            "Seed content",
        );
        if (!createdPost || postErr) throw new Error("Post creation failed");
        postId = createdPost.id;
    });

    describe("GET /blogs/:blogId/posts", () => {
        it("returns all posts for a blog", async () => {
            const res = await request(app).get(`${BASE_URL}/${blog.id}/posts`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /blogs/:blogId/posts/:postId", () => {
        it("returns specific post on a blog", async () => {
            const res = await request(app)
                .get(`${BASE_URL}/${blog.id}/posts/${postId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(postId);
        });

        it("returns 404 for non-existent post", async () => {
            const res = await request(app)
                .get(`/blogs/${blog.id}/posts/999999`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("POST /blogs/:blogId/posts", () => {
        it("creates a post with valid data", async () => {
            const res = await request(app)
                .post(`/blogs/${blog.id}/posts`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "New Post",
                    content: "This is the content.",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe("New Post");
        });

        it("fails without authorization", async () => {
            const res = await request(app)
                .post(`/blogs/${blog.id}/posts`)
                .send({
                    title: "Unauthorized Post",
                    content: "No token provided.",
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe("PATCH /:postId", () => {
        it("updates post with valid data", async () => {
            const res = await request(app)
                .patch(`/blogs/${blog.id}/posts/${postId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated Post Title" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe("Updated Post Title");
        });

        it("returns 404 for invalid postId", async () => {
            const res = await request(app)
                .patch(`/blogs/${blog.id}/posts/999999`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Doesn't matter" });

            expect(res.statusCode).toBe(404);
        });
    });

    describe("DELETE /:postId", () => {
        it("deletes a post by id", async () => {
            const [newPost] = await postService.create(
                user.uuid,
                blog.id,
                "To be deleted",
                "Soon gone.",
            );
            if (!newPost) throw new Error("new post must be non null");

            const res = await request(app)
                .delete(`/blogs/${blog.id}/posts/${newPost.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(newPost.id);
        });

        it("returns 404 for non-existent post", async () => {
            const res = await request(app)
                .delete(`/999999`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });
    });
});
