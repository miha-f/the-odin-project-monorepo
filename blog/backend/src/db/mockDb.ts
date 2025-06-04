import { faker } from "@faker-js/faker";
import { DB } from "@/db/db";
import { Blog, isBlog } from "@/models/blog.model";

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

const blogs: Blog[] = Array.from({ length: NUMBER_OF_BLOGS }, (_, i) => createBlog(i));

const mockDb: DB = {
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
};

export default mockDb;
