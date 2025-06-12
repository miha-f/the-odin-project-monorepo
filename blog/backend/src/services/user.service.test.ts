import { describe, it, expect } from "vitest";
import { createUserService } from "@/services/user.service";
import { mockDb, users } from "@/db/mockDb";

const userService = createUserService({ db: mockDb });

const randomKey = Array.from(users.keys())[Math.floor(Math.random() * users.size)];

describe("userService", () => {
    describe("getById", () => {
        const tests = [
            {
                name: "valid id",
                input: randomKey,
                expectedError: null,
                expectedDefinedUser: true
            },
            {
                name: "invalid id",
                input: "-1",
                expectedError: true,
                expectedDefinedUser: false
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedUser }) => {
            it(name, async () => {
                const [blog, err] = await userService.getById(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedUser ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });

    describe("getAll", () => {
        it("valid", async () => {
            const [blogs, err] = await userService.getAll();
            expect(err).toBeNull();
            expect(blogs).toBeDefined();
        });
    });

    describe("create", () => {
        const tests = [
            {
                name: "valid data",
                input: { username: "a", password: "p", passwordRepeat: "p" },
                expectedError: null,
                expectedDefinedUser: true,
            },
            {
                name: "missing fields",
                input: {},
                expectedError: true,
                expectedDefinedUser: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedUser }) => {
            it(name, async () => {
                const [blog, err] = await userService.create(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedUser ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });

    describe("update", () => {
        const tests = [
            {
                name: "valid update",
                id: randomKey,
                data: { username: "a" },
                expectedError: null,
                expectedDefinedUser: true,
            },
            {
                name: "no data",
                id: randomKey,
                data: {},
                expectedError: null,
                expectedDefinedUser: true,
            },
            {
                name: "invalid id",
                id: "-1",
                data: { title: "a", content: "b" },
                expectedError: true,
                expectedDefinedUser: false,
            },
        ];

        tests.forEach(({ name, id, data, expectedError, expectedDefinedUser }) => {
            it(name, async () => {
                const [blog, err] = await userService.update(id, data);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedUser ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });

    describe("remove", () => {
        const tests = [
            {
                name: "valid remove",
                input: randomKey,
                expectedError: null,
                expectedDefinedUser: true,
            },
            {
                name: "invalid index",
                input: "-1",
                expectedError: true,
                expectedDefinedUser: false,
            },
        ];

        tests.forEach(({ name, input, expectedError, expectedDefinedUser }) => {
            it(name, async () => {
                const [blog, err] = await userService.remove(input);
                expectedError ? expect(err).toBeDefined() : expect(err).toBeNull();
                expectedDefinedUser ? expect(blog).toBeDefined() : expect(blog).toBeNull();
            });
        });
    });
});
