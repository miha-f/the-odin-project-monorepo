import { describe, it, expect } from "vitest";
import { createCommentService } from "@/services/comment.service";
import { mockDb, posts } from "@/db/mockDb";

const commentService = createCommentService({ db: mockDb });

const randomPost = posts[Math.floor(Math.random() * posts.length)];

describe("blogService", () => {
    describe("getAll", () => {
        it("valid", async () => {
            const [blogs, err] = await commentService.getAll(randomPost.id);
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
                const [blog, err] = await commentService.create(randomPost.id, input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedBlog ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });
});
