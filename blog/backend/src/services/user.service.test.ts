import { describe, it, expect, beforeAll } from "vitest";
import { createUserService } from "@/services/user.service";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { User } from "@/models";

describe("userService", () => {
    const userService = createUserService({ db: mockDb });
    let users: User[];

    beforeAll(async () => {
        await seed(mockDb, 1);
        const [usersdb, _usersErr] = await userService.getAll();
        if (!usersdb) { console.log("users is not defined"); process.exit(1); }
        users = usersdb;
    });

    describe("getById", () => {
        it("valid id", async () => {
            const [user, err] = await userService.getById(users[0].uuid);
            expect(err).toBeNull();
            expect(user).toBeDefined();
            expect(user?.uuid).toBe(users[0].uuid);
        });

        it("invalid id", async () => {
            const [user, err] = await userService.getById("non-existent-uuid");
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(user).toBeNull();
        });
    });

    describe("getAll", () => {
        it("returns all users", async () => {
            const [users, err] = await userService.getAll();
            expect(err).toBeNull();
            expect(users).toBeDefined();
        });
    });

    describe("create", () => {
        it("creates user with valid data", async () => {
            const [user, err] = await userService.create("newuser", "password");
            expect(err).toBeNull();
            expect(user).toBeDefined();
            expect(user?.username).toBe("newuser");
        });

        it("fails with missing fields", async () => {
            const [user, err] = await userService.create();
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "BadRequest");
            expect(user).toBeNull();
        });
    });

    describe("update", () => {
        it("valid update", async () => {
            const [user, err] = await userService.update(users[0].uuid, { username: "updatedName" });
            expect(err).toBeNull();
            expect(user).toBeDefined();
            expect(user?.username).toBe("updatedName");
        });

        it("no data", async () => {
            const [user, err] = await userService.update(users[0].uuid, {});
            expect(err).toBeNull();
            expect(user).toBeDefined();
        });

        it("invalid id", async () => {
            const [user, err] = await userService.update("non-existent-uuid", { username: "test" });
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(user).toBeNull();
        });
    });

    describe("remove", () => {
        it("valid remove", async () => {
            const [removedUser, err] = await userService.remove(users[0].uuid);
            expect(err).toBeNull();
            expect(removedUser).toBeDefined();
        });

        it("invalid id", async () => {
            const [user, err] = await userService.remove("non-existent-uuid");
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(user).toBeNull();
        });
    });
});
