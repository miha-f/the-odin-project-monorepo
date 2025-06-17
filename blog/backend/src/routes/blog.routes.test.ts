import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { createApp } from "@/app";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { createBlogService, createUserService } from "@/services";
import { Blog } from "@/models";

describe("blogHandler", () => {
    const db = mockDb;
    const app = createApp(db);
    const BASE_URL = "/blogs";
    const blogService = createBlogService({ db: db });
    const userService = createUserService({ db: db });
    let blogs: Blog[];
    let token: string;

    beforeAll(async () => {
        await seed(db, 1);
        const [blogsDb, blogsDbErr] = await blogService.getAll();
        if (!blogsDb || blogsDbErr) {
            console.error("Failed to seed blogs");
            process.exit(1);
        }
        blogs = blogsDb;

        const [usersDb, usersDbErr] = await userService.getAll();
        if (!usersDb || usersDbErr) {
            console.error("Failed to seed users");
            process.exit(1);
        }
        const users = usersDb;

        const user = users[0];
        const loginRes = await request(app)
            .post("/auth/login")
            .send({ username: user.username, password: "password" });
        token = loginRes.body.data;
        if (!token) {
            throw new Error("Login failed; token not received");
        }

    });

    describe("GET /blogs/", () => {
        it("returns all blogs", async () => {
            const res = await request(app).get(`${BASE_URL}/`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("GET /blogs/:blogId", () => {
        it("returns blog for valid blogId", async () => {
            const res = await request(app).get(`${BASE_URL}/${blogs[0].id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(blogs[0].id);
        });

        it("returns 404 for non-existent blogId", async () => {
            const res = await request(app).get(`${BASE_URL}/999999`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("POST /blogs/", () => {
        it("creates a new blog with valid data", async () => {
            const res = await request(app)
                .post(`${BASE_URL}/`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "New Blog Title",
                    content: "This is the content of the new blog.",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.title).toBe("New Blog Title");
        });

        it("fails with missing fields", async () => {
            const res = await request(app)
                .post(`${BASE_URL}/`)
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("PATCH /blogs/:blogId", () => {
        it("updates blog with valid data", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/${blogs[0].id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Updated Title" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.title).toBe("Updated Title");
        });

        it("no-op update with empty body", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/${blogs[0].id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(blogs[0].id);
        });

        it("returns 404 for invalid blogId", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/999999`)
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "Whatever" });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("DELETE /blogs/:blogId", () => {
        it("removes blog by id", async () => {
            const blogToDelete = blogs[1]; // assuming seed gave us more than 1
            const res = await request(app)
                .delete(`${BASE_URL}/${blogToDelete.id}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.id).toBe(blogToDelete.id);
        });

        it("returns 404 for non-existent blogId", async () => {
            const res = await request(app)
                .delete(`${BASE_URL}/999999`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });
});
