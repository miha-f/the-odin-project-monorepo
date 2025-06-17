import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import { createApp } from "@/app";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { createUserService } from "@/services/user.service";
import { User } from "@/models";

describe("userHandler", () => {
    const db = mockDb;
    const app = createApp(db);
    const BASE_URL = "/users"
    const userService = createUserService({ db: db });
    let users: User[];
    let token: string;

    beforeAll(async () => {
        await seed(db, 1);
        const [usersdb, err] = await userService.getAll();
        if (!usersdb || err) {
            console.error("Failed to seed users");
            process.exit(1);
        }
        users = usersdb;

        const user = users[0];
        const loginRes = await request(app)
            .post("/auth/login")
            .send({ username: user.username, password: "password" });
        token = loginRes.body.data;
        if (!token) {
            throw new Error("Login failed; token not received");
        }

    });

    describe("GET /users/:uuid", () => {
        it("returns user for valid uuid", async () => {
            const res = await request(app).get(`${BASE_URL}/${users[0].uuid}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.uuid).toBe(users[0].uuid);
        });

        it("returns 404 for non-existent user", async () => {
            const res = await request(app).get(`${BASE_URL}/non-existent-uuid`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("GET /users/", () => {
        it("returns all users", async () => {
            const res = await request(app).get(`${BASE_URL}/`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("POST /users/", () => {
        it("creates a new user with valid data", async () => {
            const res = await request(app).post(`${BASE_URL}/`).send({
                username: "newuser",
                password: "newpass",
                passwordRepeat: "newpass",
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty("uuid");
            expect(res.body.data.username).toBe("newuser");
        });

        it("fails with missing fields", async () => {
            const res = await request(app).post(`${BASE_URL}/`).send({});
            expect(res.statusCode).toBe(400); // Assuming 400 for BadRequest
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("PATCH /users/:uuid", () => {
        it("updates user with valid data", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/${users[0].uuid}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ username: "updatedUser" });

            expect(res.statusCode).toBe(200);
            expect(res.body.data.username).toBe("updatedUser");
        });

        it("no-op update with empty body", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/${users[0].uuid}`)
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty("uuid", users[0].uuid);
        });

        it("returns 404 for invalid uuid", async () => {
            const res = await request(app)
                .patch(`${BASE_URL}/non-existent-uuid`)
                .set("Authorization", `Bearer ${token}`)
                .send({ username: "whatever" });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error");
        });
    });

    describe("DELETE /users/:uuid", () => {
        it("removes user by uuid", async () => {
            const userToDelete = users[0];
            const res = await request(app)
                .delete(`${BASE_URL}/${userToDelete.uuid}`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.data.uuid).toBe(userToDelete.uuid);
        });

        it("returns 404 for non-existent uuid", async () => {
            const res = await request(app)
                .delete(`${BASE_URL}/non-existent-uuid`)
                .set("Authorization", `Bearer ${token}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("error");
        });
    });
});
