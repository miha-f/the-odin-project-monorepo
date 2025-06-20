import { createInMemoryStore } from "@/utils/inMemoryStore";
import { Post, PostDbInterface, PostGetAllOptions, PostUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

export const createPostMockDb = (): PostDbInterface => {
    const postStore = createInMemoryStore<Post, string>((post) => getPostKey(post.id, post.blogId));

    const getPostKey = (id: number, blogId: number): string => {
        return `${id}:${blogId}`;
    }

    const db: PostDbInterface = {
        getByIdAndBlogId: async (id: number, blogId: number): DbResult<Post> => {
            const result = postStore.get(getPostKey(id, blogId));
            return result || null;
        },

        getAll: async (options: PostGetAllOptions): DbResult<Post[]> => {
            return postStore.getAll(options);
        },

        getAllByBlogId: async (blogId: number, options: PostGetAllOptions): DbResult<Post[]> => {
            return postStore.getAll(options).filter(p => p.blogId === blogId);
        },

        getLatestPostInBlog: async (blogId: number): DbResult<Post> => {
            const result = postStore.getAll().filter(p => p.blogId === blogId).sort((p1, p2) => p2.id - p1.id);
            return result ? result[0] : null;
        },

        create: async (id: number, authorId: Uuid, blogId: number, title: string, content: string, images?: string[]): DbResult<Post> => {
            const post: Post = {
                id: id,
                authorId: authorId,
                blogId: blogId,
                title: title,
                content: content,
                images: images,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            postStore.create(post);
            return post;
        },

        update: async (id: number, blogId: number, data: PostUpdateData): DbResult<Post> => {
            const result = postStore.update(getPostKey(id, blogId), data);
            return result || null;
        },

        remove: async (id: number, blogId: number): DbResult<Post> => {
            const result = postStore.delete(getPostKey(id, blogId));
            return result || null;
        },

        transaction: async <T>(callback: (tx: PostDbInterface) => Promise<T>): Promise<T> => {
            return await callback(db);
        }
    };

    return db;
};
