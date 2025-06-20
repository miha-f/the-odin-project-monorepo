import { describe, it, expect, beforeAll } from "vitest";
import { createPostService, createBlogService, createUserService } from "@/services";
import mockDb from "@/db/mockDb";
import { seed } from "@/db/seed";
import { Blog } from "@/api/blog";
import { User } from "@/api/user";
import { Post } from "@/api/post";

describe("postService", () => {
    const blogService = createBlogService(mockDb);
    const userService = createUserService(mockDb);
    const postService = createPostService(mockDb);
    let users: User[];
    let blogs: Blog[];
    let posts: Post[];

    beforeAll(async () => {
        await seed(mockDb, 1);
        const [usersdb, _usersErr] = await userService.getAll({ page: 1, limit: 100 });
        if (!usersdb) { console.log("users is not defined"); process.exit(1); }
        const [blogsdb, _blogsErr] = await blogService.getAll({ page: 1, limit: 100 });
        if (!blogsdb) { console.log("blogs is not defined"); process.exit(1); }
        const [postsdb, _postsErr] = await postService.getAll({ page: 1, limit: 100 });
        if (!postsdb) { console.log("posts is not defined"); process.exit(1); }
        users = usersdb;
        blogs = blogsdb;
        posts = postsdb;
    });

    describe("getById", () => {
        it("valid id", async () => {
            const [post, err] = await postService.getByIdAndBlogId(posts[0].id, posts[0].blogId);
            expect(err).toBeNull();
            expect(post).toBeDefined();
        });

        it("invalid id", async () => {
            const [post, err] = await postService.getByIdAndBlogId(-1, -1);
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(post).toBeDefined();
        });
    });

    describe("getAll", () => {
        it("returns all posts", async () => {
            const [posts, err] = await postService.getAll({ page: 1, limit: 100 });
            expect(err).toBeNull();
            expect(posts).toBeDefined();
        });
    });

    describe("create", () => {
        it("creates post with valid data", async () => {
            const [post, err] = await postService.create(
                blogs[0].authorId,
                blogs[0].id,
                "New Title",
                "New Content"
            );
            expect(err).toBeNull();
            expect(post).toBeDefined();
            expect(post?.title).toBe("New Title");
            expect(post?.content).toBe("New Content");
            expect(post?.blogId).toBe(blogs[0].id);
        });

        it("fails to create post with missing fields", async () => {
            const [post, err] = await postService.create("", -1, "", "");
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "BadRequest");
            expect(post).toBeNull();
        });
    });

    describe("update", () => {
        it("valid update", async () => {
            const [post, err] = await postService.update(posts[0].id,
                posts[0].blogId,
                {
                    title: "Updated Title",
                    content: "Updated Content",
                }
            );
            expect(err).toBeNull();
            expect(post).toBeDefined();
            expect(post?.title).toBe("Updated Title");
        });

        it("no data", async () => {
            const [post, err] = await postService.update(posts[0].id, posts[0].blogId, {});
            expect(err).toBeNull();
            expect(post).toBeDefined();
        });

        it("invalid id", async () => {
            const [post, err] = await postService.update(-1, -1,
                {
                    title: "Doesn't Matter",
                    content: "Still doesn't matter",
                }
            );
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(post).toBeNull();
        });
    });

    describe("remove", () => {
        it("valid remove", async () => {
            const [removedPost, err] = await postService.remove(posts[0].id, posts[0].blogId);
            expect(err).toBeNull();
            expect(removedPost).toBeDefined();
        });

        it("invalid id", async () => {
            const [post, err] = await postService.remove(-1, -1);
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "NotFound");
            expect(post).toBeNull();
        });
    });
});
