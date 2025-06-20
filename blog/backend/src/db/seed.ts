import { faker } from '@faker-js/faker';
import { prisma } from "@/db/prismaDb";
import {
    createUserService,
    createBlogService,
    createPostService,
    createCommentService
} from '@/services';
import { User } from "@/api/user";
import { Post } from "@/api/post";
import { Blog } from "@/api/blog";
import { DB } from "@/db/db";

export const createSeed = (db: DB) => {
    const userService = createUserService(db);
    const blogService = createBlogService(db);
    const postService = createPostService(db);
    const commentService = createCommentService(db);

    return {
        seedUsers: async (n = 5): Promise<User[]> => {
            const users: User[] = [];
            for (let i = 1; i <= n; i++) {
                const [user, error] = await userService.create(faker.internet.username(), "password");
                if (error) console.log(error);
                if (user)
                    users.push(user);
            }
            return users;
        },

        seedBlogs: async (users: User[], n = 5): Promise<Blog[]> => {
            const blogs: Blog[] = [];
            for (let i = 1; i <= n; i++) {
                const [blog, error] = await blogService.create(
                    faker.helpers.arrayElement(users).uuid,
                    faker.lorem.word({ length: { min: 3, max: 7 } }),
                    faker.lorem.sentence({ min: 3, max: 20 }),
                    undefined,
                );
                if (error) console.log(error);
                if (blog)
                    blogs.push(blog);
            }
            return blogs;
        },

        seedPosts: async (users: User[], blogs: Blog[], n = 5) => {
            const posts: Post[] = [];

            // NOTE(miha): Create mapping between authorId (uuid:string) and his/hers
            // blogs. We need to append post to blog that belongs to its owner, otherwise
            // we get errors!
            const usersToBlogs = new Map<string, Blog[]>();
            for (const blog of blogs) {
                if (!usersToBlogs.has(blog.authorId)) {
                    usersToBlogs.set(blog.authorId, []);
                }
                usersToBlogs.get(blog.authorId)!.push(blog);
            }

            for (let i = 1; i <= n; i++) {
                const authorId = faker.helpers.arrayElement(users).uuid;
                const blog = faker.helpers.arrayElement(usersToBlogs.get(authorId) || []);
                if (!blog) { console.log("empty blog... skipping..."); continue; }
                const [post, error] = await postService.create(
                    authorId,
                    blog.id,
                    faker.lorem.word({ length: { min: 3, max: 7 } }),
                    faker.lorem.sentence({ min: 3, max: 20 })
                );
                if (error) console.log(error);
                if (post)
                    posts.push(post);
            }
            return posts;
        },

        seedComments: async (users: User[], blogs: Blog[], posts: Post[], n = 5) => {
            // NOTE(miha): Create mapping between authorId (uuid:string) and his/hers
            // blogs. We need to append post to blog that belongs to its owner, otherwise
            // we get errors!
            const usersToBlogs = new Map<string, Blog[]>();
            for (const blog of blogs) {
                if (!usersToBlogs.has(blog.authorId)) {
                    usersToBlogs.set(blog.authorId, []);
                }
                usersToBlogs.get(blog.authorId)!.push(blog);
            }
            const blogsToPosts = new Map<number, Post[]>();
            for (const post of posts) {
                if (!blogsToPosts.has(post.blogId)) {
                    blogsToPosts.set(post.blogId, []);
                }
                blogsToPosts.get(post.blogId)!.push(post);
            }

            const comments = [];

            for (let i = 1; i <= n; i++) {
                const authorId = faker.helpers.arrayElement(users).uuid;
                const blog = faker.helpers.arrayElement(usersToBlogs.get(authorId) || []);
                if (!blog) { console.log("empty blog... skipping..."); continue; }
                const post = faker.helpers.arrayElement(blogsToPosts.get(blog.id) || []);
                if (!post) { console.log("empty post... skipping..."); continue; }
                const [comment, error] = await commentService.create(
                    authorId,
                    blog.id,
                    post.id,
                    faker.lorem.sentence({ min: 3, max: 20 })
                );
                if (error) console.log(error);
                if (comment)
                    comments.push(comment);
            }
            return comments;

            // NOTE(miha): Bellow is "concurrent" execution, due to some data races 
            // (selecting same blogId and postId randomlly) we don't get 1000 comments.
            // const limit = pLimit(5);
            // const tasks = Array.from({ length: n }).map(() => limit(async () => {
            //     const authorId = faker.helpers.arrayElement(users).uuid;
            //     const blog = faker.helpers.arrayElement(usersToBlogs.get(authorId) || []);
            //     if (!blog) return null;
            //
            //     const post = faker.helpers.arrayElement(blogsToPosts.get(blog.id) || []);
            //     if (!post) return null;
            //
            //     const [comment, error] = await commentService.create(
            //         authorId,
            //         blog.id,
            //         post.id,
            //         faker.lorem.sentence({ min: 3, max: 20 })
            //     );
            //     if (error) console.log(error);
            //     return comment ?? null;
            // }));
            //
            // const results = await Promise.all(tasks);
            // return results.filter(Boolean);
        },

    };
};

export const seed = async (db: DB, N = 10, print = false) => {
    const s = createSeed(db);
    if (print) console.log("seeding users");
    const users = await s.seedUsers(N);
    if (print) console.log(`seed ${users.length} users`);
    if (print) console.log("seeding blogs");
    const blogs = await s.seedBlogs(users, N * 10);
    if (print) console.log(`seed ${blogs.length} blogs`);
    if (print) console.log("seeding posts");
    const posts = await s.seedPosts(users, blogs, N * 10 * 10);
    if (print) console.log(`seed ${posts.length} posts`);
    if (print) console.log("seeding comments");
    const comments = await s.seedComments(users, blogs, posts, N * 10 * 10 * 10);
    if (print) console.log(`seed ${comments.length} comments`);

    if (print) console.log('✅ Seeding complete!');
}

const main = async () => {
    console.log("We are runnign main script....");
    seed(prisma, 10, true);
}

if (require.main === module) {
    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
}
