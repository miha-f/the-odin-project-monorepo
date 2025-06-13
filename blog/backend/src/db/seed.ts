import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { createUserService } from '@/services/user.service.ts';
import { createBlogService } from '@/services/blog.service.ts';
import { createPostService } from '@/services/post.service.ts';
import { User, Blog } from "@/models";

const prisma = new PrismaClient();
const userService = createUserService({ db: prisma });
// const authService = createUserService(prisma);
const blogService = createBlogService({ db: prisma });
const postService = createPostService({ db: prisma });
// const commentService = createUserService(prisma);


const seedUsers = async (n = 5): Promise<User[]> => {
    const users: User[] = [];
    for (let i = 1; i <= n; i++) {
        const [user, error] = await userService.create(faker.internet.username(), "password");
        if (error) console.log(error);
        if (user)
            users.push(user);
    }
    return users;
};

const seedBlogs = async (users: User[], n = 5): Promise<Blog[]> => {
    const blogs: Blog[] = [];
    for (let i = 1; i <= n; i++) {
        const [blog, error] = await blogService.create(
            faker.helpers.arrayElement(users).uuid,
            faker.lorem.word({ length: { min: 3, max: 7 } }),
            faker.lorem.sentence({ min: 3, max: 20 })
        );
        if (error) console.log(error);
        if (blog)
            blogs.push(blog);
    }
    return blogs;
};

const seedPosts = async (users: User[], blogs: Blog[], n = 5) => {
    const posts = [];

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
        posts.push(post);
    }
    return posts;
};

const main = async () => {
    const N = 10;
    console.log("seeding users");
    const users = await seedUsers(N);
    console.log(`seed ${users.length} users`);
    console.log("seeding blogs");
    const blogs = await seedBlogs(users, N * 10);
    console.log(`seed ${blogs.length} blogs`);
    console.log("seeding posts");
    const posts = await seedPosts(users, blogs, N * 10 * 10);
    console.log(`seed ${posts.length} posts`);

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
