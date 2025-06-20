import { createInMemoryStore } from "@/utils/inMemoryStore";
import { Blog, BlogDbInterface, BlogGetAllOptions, BlogUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

export const createBlogMockDb = (): BlogDbInterface => {
    const blogStore = createInMemoryStore<Blog, number>((blog) => blog.id);

    return {
        getById: async (id: number): DbResult<Blog> => {
            return blogStore.get(id) || null;
        },

        getAll: async (options: BlogGetAllOptions): DbResult<Blog[]> => {
            return blogStore.getAll(options);
        },

        create: async (authorId: Uuid, title: string, content: string, image: string | undefined): DbResult<Blog> => {
            const blog: Blog = {
                id: blogStore.size() + 1,
                authorId: authorId,
                title: title,
                content: content,
                image: image,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            blogStore.create(blog);
            return blog;
        },

        update: async (id: number, data: BlogUpdateData): DbResult<Blog> => {
            return blogStore.update(id, data) || null;
        },

        remove: async (id: number): DbResult<Blog> => {
            return blogStore.delete(id) || null;
        },
    };
};
