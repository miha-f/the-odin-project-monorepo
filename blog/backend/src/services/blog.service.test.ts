import { describe, it, expect } from "vitest";
import { createBlogService } from "./blog.service";
import mockDb from "@/db/mockDb";
import { Blog } from "@/models/blog.model";

const blogService = createBlogService({ db: mockDb });

describe("blogService", () => {
    describe("getById", () => {
        it("valid id", async () => {
            const [blog, err] = await blogService.getById(0);
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid id", async () => {
            const [blog, err] = await blogService.getById(-1);
            expect(err).toBeDefined();
            expect(blog).toBeNull();
        });
    });

    describe("getAll", () => {
        it("valid", async () => {
            const [blogs, err] = await blogService.getAll();
            expect(err).toBeNull();
            expect(blogs).toBeDefined();
        });
    });

    describe("create", () => {
        it("valid", async () => {
            const [blog, err] = await blogService.create({ title: "a", content: "b" });
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid", async () => {
            const [blog, err] = await blogService.create({});
            expect(err).toBeDefined();
            expect(blog).toBeNull();
        });
    });

    describe("update", () => {
        it("valid", async () => {
            const [blog, err] = await blogService.update(0, { title: "a", content: "b" });
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("no data", async () => {
            const [blog, err] = await blogService.update(0, {});
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid index", async () => {
            const [blog, err] = await blogService.update(-1, { title: "a", content: "b" });
            expect(err).toBeDefined();
            expect(blog).toBeNull();
        });
    });

    describe("remove", () => {
        it("valid", async () => {
            const [blog, err] = await blogService.remove(0);
            expect(err).toBeNull();
            expect(blog).toBeDefined();
        });

        it("invalid index", async () => {
            const [blog, err] = await blogService.remove(-1);
            expect(err).toBeDefined();
            expect(blog).toBeNull();
        });
    });
});
