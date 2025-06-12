import { faker } from "@faker-js/faker";
import { DB } from "@/db/db";
import { Blog, isBlog } from "@/models/blog.model";
import { User, isUserIn } from "@/models/user.model";

// NOTE(miha): Code for generating blogs
const NUMBER_OF_BLOGS = 10;

const createBlog = (index: number): Blog => ({
    id: index,
    authorId: faker.string.uuid(),
    title: faker.lorem.word({ length: { min: 3, max: 7 } }),
    content: faker.lorem.sentence({ min: 3, max: 20 }),
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createPartialBlog = (index: number): Partial<Blog> => ({
    id: index,
    authorId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
});

export const blogs: Blog[] = Array.from({ length: NUMBER_OF_BLOGS }, (_, i) => createBlog(i));


// NOTE(miha): Code for generating users
const NUMBER_OF_USERS = 10;

const createUser = (uuid: string): User => ({
    uuid: uuid,
    username: faker.internet.username(),
    passwordHash: "",
    createdAt: new Date(),
    updatedAt: new Date(),
});

const createPartialUser = (): Partial<User> => ({
    uuid: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
});

export const users: Map<string, User> = new Map(
    Array.from({ length: NUMBER_OF_USERS }, () => {
        const uuid = faker.string.uuid();
        const user = createUser(uuid);
        return [uuid, user] as [string, User];
    })
);

export const mockDb: DB = {
    blog: {
        findMany: async () => {
            return blogs;
        },

        findUnique: async ({ where }) => {
            return blogs.find(blog => blog.id === where.id) || null;
        },

        create: async ({ data }) => {
            const newBlog = { ...createPartialBlog(blogs.length), ...data };
            if (!isBlog(newBlog))
                throw new Error("Can't create blog, missing one or more fields");
            blogs.push(newBlog);
            return newBlog;
        },

        update: async ({ where, data }) => {
            const blogIndex = blogs.findIndex((b) => b.id === where.id);
            if (blogIndex === -1) return null;
            blogs[blogIndex] = { ...blogs[blogIndex], ...data };
            return blogs[blogIndex];
        },

        delete: async ({ where }) => {
            const blogIndex = blogs.findIndex((b) => b.id === where.id);
            if (blogIndex === -1) return null;
            const [deleted] = blogs.splice(blogIndex, 1);
            return deleted;
        },
    },
    user: {
        findMany: async () => {
            return Array.from(users.values());
        },

        findUnique: async ({ where }) => {
            return users.get(where.uuid) || null;
        },

        create: async ({ data }) => {
            const newUser = { ...createPartialUser(), ...data };
            if (!isUserIn(newUser))
                throw new Error("Can't create user, missing one or more fields");
            users.set(newUser.uuid, newUser);
            return newUser;
        },

        update: async ({ where, data }) => {
            const user = users.get(where.uuid);
            if (!user) return null;
            const updatedUser = { ...user, ...data };
            users.set(where.uuid, updatedUser);
            return updatedUser;
        },

        delete: async ({ where }) => {
            const user = users.get(where.uuid);
            if (!user) return null;
            users.delete(where.uuid);
            return user;
        },
    },
};

export default mockDb;
