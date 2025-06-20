import { describe, it, expect, beforeAll } from "vitest";
import { createBlogService, createUserService } from "@/services";
import mockDb from "@/db/mockDb";
import { seed } from "@/db/seed";
import { User } from "@/api/user";
import { Blog } from "@/api/blog";

describe("blogService", () => {
    const blogService = createBlogService(mockDb);
    const userService = createUserService(mockDb);
    let users: User[];
    let blogs: Blog[];

    beforeAll(async () => {
        await seed(mockDb, 1);
        const [usersdb, _usersErr] = await userService.getAll({ page: 1, limit: 100 });
        if (!usersdb) { console.log("users is not defined"); process.exit(1); }
        const [blogsdb, _blogsErr] = await blogService.getAll({ page: 1, limit: 100 });
        if (!blogsdb) { console.log("blogs is not defined"); process.exit(1); }
        users = usersdb;
        blogs = blogsdb;
    });

    describe("getById", () => {
        it("valid", async () => {
            const [blog, err] = await blogService.getById(blogs[0].id);
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid", async () => {
            const [blog, err] = await blogService.getById(-1);
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(blog).toBeDefined();
        });
    });

    describe("getAll", () => {
        it("valid", async () => {
            const [blogs, err] = await blogService.getAll({ page: 1, limit: 100 });
            expect(err).toBeNull();
            expect(blogs).toBeDefined();
        });
    });

    describe("create", () => {
        it("creates blog with valid data", async () => {
            const [blog, err] = await blogService.create(users[0].uuid, "a", "b", undefined);
            expect(err).toBeNull();
            expect(blog).toBeDefined();
            expect(blog?.title).toBe("a");
            expect(blog?.content).toBe("b");
            expect(blog?.authorId).toBe(users[0].uuid);
        });

        it("fails to create blog with missing fields", async () => {
            const [blog, err] = await blogService.create("", "", "", undefined);
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "BadRequest");
            expect(blog).toBeNull();
        });

        // it("fails to create blog with invalid uuid", async () => {
        //     const [blog, err] = await blogService.create("-1", "Title", "Content", undefined);
        //     console.log(blog, err);
        //     expect(err).toBeDefined();
        //     expect(err).toHaveProperty("type", "InternalError");
        //     expect(blog).toBeNull();
        // });
    });

    describe("update", () => {
        it("valid update", async () => {
            const [blog, err] = await blogService.update(blogs[0].id, { title: "a", content: "b" });
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("no data", async () => {
            const [blog, err] = await blogService.update(blogs[0].id, {});
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid id", async () => {
            const [blog, err] = await blogService.update(-1, { title: "a", content: "b" });
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(blog).toBeNull();
        });
    });

    describe("remove", () => {
        it("valid remove", async () => {
            const [blog, err] = await blogService.remove(blogs[0].id);
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid id", async () => {
            const [blog, err] = await blogService.remove(-1);
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(blog).toBeNull();
        });
    });
});
