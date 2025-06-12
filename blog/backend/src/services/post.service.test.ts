import { describe, it, expect } from "vitest";
import { createPostService } from "@/services/post.service";
import mockDb from "@/db/mockDb";

const postService = createPostService({ db: mockDb });

describe("postService", () => {
    describe("getById", () => {
        const tests = [
            { name: "valid id", input: 0, expectedError: null, expectedDefinedPost: true },
            { name: "invalid id", input: -1, expectedError: true, expectedDefinedPost: false },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedPost }) => {
            it(name, async () => {
                const [post, err] = await postService.getById(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedPost ? expect(post).toBeDefined() : expect(post).toBeNull();
            });
        });
    });

    describe("getAll", () => {
        it("valid", async () => {
            const [posts, err] = await postService.getAll();
            expect(err).toBeNull();
            expect(posts).toBeDefined();
        });
    });

    describe("create", () => {
        const tests = [
            {
                name: "valid data",
                input: { title: "a", content: "b" },
                expectedError: null,
                expectedDefinedPost: true,
            },
            {
                name: "missing fields",
                input: {},
                expectedError: true,
                expectedDefinedPost: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedPost }) => {
            it(name, async () => {
                const [post, err] = await postService.create(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedPost ? expect(post).toBeDefined() : expect(post).toBeNull();
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
                expectedDefinedPost: true,
            },
            {
                name: "no data",
                id: 0,
                data: {},
                expectedError: null,
                expectedDefinedPost: true,
            },
            {
                name: "invalid id",
                id: -1,
                data: { title: "a", content: "b" },
                expectedError: true,
                expectedDefinedPost: false,
            },
        ];

        tests.forEach(({ name, id, data, expectedError, expectedDefinedPost }) => {
            it(name, async () => {
                const [post, err] = await postService.update(id, data);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedPost ? expect(post).toBeDefined() : expect(post).toBeNull();
            });
        });
    });

    describe("remove", () => {
        const tests = [
            {
                name: "valid remove",
                input: 0,
                expectedError: null,
                expectedDefinedPost: true,
            },
            {
                name: "invalid index",
                input: -1,
                expectedError: true,
                expectedDefinedPost: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedPost }) => {
            it(name, async () => {
                const [post, err] = await postService.remove(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedPost ? expect(post).toBeDefined() : expect(post).toBeNull();
            });
        });
    });
});
