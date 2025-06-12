import { describe, it, expect } from "vitest";
import { createBlogService } from "@/services/blog.service";
import mockDb from "@/db/mockDb";

const blogService = createBlogService({ db: mockDb });

describe("blogService", () => {
    describe("getById", () => {
        const tests = [
            { name: "valid id", input: 0, expectedError: null, expectedDefinedBlog: true },
            { name: "invalid id", input: -1, expectedError: true, expectedDefinedBlog: false },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedBlog }) => {
            it(name, async () => {
                const [blog, err] = await blogService.getById(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedBlog ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
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
        const tests = [
            {
                name: "valid data",
                input: { title: "a", content: "b" },
                expectedError: null,
                expectedDefinedBlog: true,
            },
            {
                name: "missing fields",
                input: {},
                expectedError: true,
                expectedDefinedBlog: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedBlog }) => {
            it(name, async () => {
                const [blog, err] = await blogService.create(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedBlog ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });

    describe("update", () => {
        const tests = [
            {
                name: "valid update",
                id: 0,
                data: { title: "a", content: "b" },
                expectedError: null,
                expectedDefinedBlog: true,
            },
            {
                name: "no data",
                id: 0,
                data: {},
                expectedError: null,
                expectedDefinedBlog: true,
            },
            {
                name: "invalid id",
                id: -1,
                data: { title: "a", content: "b" },
                expectedError: true,
                expectedDefinedBlog: false,
            },
        ];

        tests.forEach(({ name, id, data, expectedError, expectedDefinedBlog }) => {
            it(name, async () => {
                const [blog, err] = await blogService.update(id, data);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedBlog ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });

    describe("remove", () => {
        const tests = [
            {
                name: "valid remove",
                input: 0,
                expectedError: null,
                expectedDefinedBlog: true,
            },
            {
                name: "invalid index",
                input: -1,
                expectedError: true,
                expectedDefinedBlog: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedBlog }) => {
            it(name, async () => {
                const [blog, err] = await blogService.remove(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedBlog ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });
});
