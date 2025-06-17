import { describe, it, expect, beforeAll } from "vitest";
import { createCommentService } from "@/services/comment.service";
import { createPostService } from "@/services/post.service";
import { createBlogService } from "@/services/blog.service";
import { createUserService } from "@/services/user.service";
import { mockDb } from "@/db/mockDb";
import { seed } from "@/db/seed";
import { User, Blog, Post, Comment } from "@/models";


describe("blogService", () => {
    const blogService = createBlogService({ db: mockDb });
    const userService = createUserService({ db: mockDb });
    const postService = createPostService({ db: mockDb });
    const commentService = createCommentService({ db: mockDb });
    let users: User[];
    let blogs: Blog[];
    let posts: Post[];

    beforeAll(async () => {
        await seed(mockDb, 1);
        const [usersdb, _usersErr] = await userService.getAll();
        if (!usersdb) { console.log("users is not defined"); process.exit(1); }
        const [blogsdb, _blogsErr] = await blogService.getAll();
        if (!blogsdb) { console.log("blogs is not defined"); process.exit(1); }
        const [postsdb, _postsErr] = await postService.getAll();
        if (!postsdb) { console.log("posts is not defined"); process.exit(1); }
        users = usersdb;
        blogs = blogsdb;
        posts = postsdb;
    });


    describe("getAll", () => {
        it("returns all comments for valid blog and post", async () => {
            const post = posts[0];
            const [comments, err] = await commentService.getAll(post.blogId, post.id);
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
            const [comment, err] = await commentService.create("", "");
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
