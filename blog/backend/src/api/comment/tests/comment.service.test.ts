import { describe, it, expect, beforeAll } from "vitest";
import {
    createUserService,
    createBlogService,
    createPostService,
    createCommentService,
} from "@/services";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { User } from "@/api/user";
import { Blog } from "@/api/blog";
import { Post } from "@/api/post";

describe("blogService", () => {
    const blogService = createBlogService(mockDb);
    const userService = createUserService(mockDb);
    const postService = createPostService(mockDb);
    const commentService = createCommentService(mockDb);
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


    describe("getAll", () => {
        it("returns all comments for valid blog and post", async () => {
            const post = posts[0];
            const [comments, err] = await commentService.getAll(post.blogId, post.id, { page: 1, limit: 100 });
            expect(err).toBeNull();
            expect(comments).toBeDefined();
        });
    });

    describe("create", () => {
        it("creates comment with valid data", async () => {
            const post = posts[0];
            const [comment, err] = await commentService.create(
                post.authorId,
                post.blogId,
                post.id,
                "This is my comment",
            );
            expect(err).toBeNull();
            expect(comment).toBeDefined();
            expect(comment?.postId).toBe(post.id);
            expect(comment?.content).toBe("This is my comment");
        });

        it("fails to create comment with missing fields", async () => {
            const [comment, err] = await commentService.create("", -1, -1, "");
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "BadRequest");
            expect(comment).toBeNull();
        });

        it("fails to create comment with invalid post id", async () => {
            const [comment, err] = await commentService.create(
                "", -1, -1, ""
            );
            expect(err).toBeDefined();
            expect(err).toHaveProperty("type", "BadRequest");
            expect(comment).toBeNull();
        });
    });

});
