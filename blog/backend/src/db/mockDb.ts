import { DB, } from "@/db/db";
import bcrypt from 'bcryptjs';
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Comment } from "@/models/comment.model";

export const createInMemoryStore = <T, K>(getId: (t: T) => K) => {
    const map = new Map<K, T>();

    return {
        create: (item: T): void => {
            map.set(getId(item), item);
        },

        get: (id: K): T | undefined => {
            return map.get(id);
        },

        getAll: (): T[] => {
            return Array.from(map.values());
        },

        update: (id: K, updates: Partial<T>): T | undefined => {
            const existing = map.get(id);
            if (!existing) return undefined;
            const updated = { ...existing, ...updates };
            map.set(id, updated);
            return updated;
        },

        delete: (id: K): T | undefined => {
            const existing = map.get(id);
            if (!existing) return undefined;
            map.delete(id);
            return existing;
        },

        size: () => {
            return map.size
        },
    };
};

export const createInMemoryDB = (): DB => {
    const userStore = createInMemoryStore<User, string>((user) => user.uuid);
    const postStore = createInMemoryStore<Post, number>((post) => post.id);
    const blogStore = createInMemoryStore<Blog, number>((blog) => blog.id);
    const commentStore = createInMemoryStore<Comment, number>((comment) => comment.id);

    return {
        user: {
            findUnique: async (args: { where: { uuid?: string } | { username?: string } }): Promise<User | null> => {
                if ('uuid' in args.where && args.where.uuid)
                    return userStore.get(args.where.uuid) || null;

                if ('username' in args.where) {
                    const username = (args.where as { username: string }).username;
                    return userStore.getAll().find((user) => user.username === username) || null;
                }

                return null;
            },

            findMany: async (): Promise<User[]> => userStore.getAll(),

            create: async (args: { data: Partial<User> }): Promise<User> => {
                const hash = await bcrypt.hash("password", 10);
                const user: User = {
                    uuid: crypto.randomUUID(),
                    username: args.data.username!,
                    passwordHash: hash,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                userStore.create(user);
                return user;
            },

            update: async (args: { where: { uuid: string }, data: Partial<User> }): Promise<User | null> => {
                return userStore.update(args.where.uuid, args.data) || null;
            },

            delete: async (args: { where: { uuid: string } }): Promise<User | null> => {
                return userStore.delete(args.where.uuid) || null;
            },
        },

        post: {
            findUnique: async (args: { where: { id: number } }): Promise<Post | null> => {
                return postStore.get(args.where.id) || null;
            },

            findFirst: async (args: { where: { blogId: number }, orderBy: { id: string }, select: { id: boolean } }): Promise<Partial<Post> | null> => {
                const all = postStore.getAll();
                const filtered = Array.from(all).filter(blog => blog.blogId === args.where.blogId);
                if (filtered.length === 0) return null;
                filtered.sort((a, b) =>
                    args.orderBy.id === 'asc' ? a.id - b.id : b.id - a.id
                );
                const first = filtered[0];
                if (args.select.id) {
                    return { id: first.id };
                }
                return first;
            },

            findMany: async (args?: { where: { blogId?: number, id?: number } }): Promise<Post[]> => {
                const posts = postStore.getAll();
                // if (args?.where?.blogId) {
                //     return posts.filter((post) => post.blogId === args.where.blogId);
                // }
                // return posts;

                return posts.filter((post) => {
                    const matchesBlogId = args?.where?.blogId === undefined || post.blogId === args.where.blogId;
                    const matchesId = args?.where?.id === undefined || post.id === args.where.id;
                    return matchesBlogId && matchesId;
                });
            },

            create: async (args: { data: Partial<Post> }): Promise<Post> => {
                if (!args.data.authorId || typeof args.data.authorId !== "string" || args.data.authorId.trim() === "")
                    throw new Error("Invalid or missing authorId");
                if (!args.data.blogId || typeof args.data.blogId !== "number")
                    throw new Error("Invalid or missing blogId");

                const author = userStore.get(args.data.authorId);
                if (!author)
                    throw new Error("Author not found");

                const blog = blogStore.get(args.data.blogId);
                if (!blog)
                    throw new Error("Blog not found");

                const post: Post = {
                    id: args.data.id!,
                    authorId: args.data.authorId!,
                    blogId: args.data.blogId!,
                    content: args.data.content!,
                    title: args.data.title!,
                    images: args.data.images,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                postStore.create(post);
                return post;
            },

            update: async (args: { where: { id: number }, data: Partial<Post> }): Promise<Post | null> => {
                return postStore.update(args.where.id, args.data) || null;
            },

            delete: async (args: { where: { id: number } }): Promise<Post | null> => {
                return postStore.delete(args.where.id) || null;
            },
        },

        blog: {
            findUnique: async (args: { where: { id: number } }): Promise<Blog | null> => {
                return blogStore.get(args.where.id) || null;
            },

            findMany: async (): Promise<Blog[]> => blogStore.getAll(),

            create: async (args: { data: Partial<Blog> }): Promise<Blog> => {
                if (!args.data.authorId || typeof args.data.authorId !== "string" || args.data.authorId.trim() === "") {
                    throw new Error("Invalid or missing authorId");
                }

                const author = userStore.get(args.data.authorId);
                if (!author) {
                    throw new Error("Author not found");
                }

                if (!args.data.title || !args.data.content)
                    throw new Error("Invalid or missing data");

                const blog: Blog = {
                    id: blogStore.size() + 1,
                    authorId: args.data.authorId!,
                    title: args.data.title!,
                    content: args.data.content!,
                    image: args.data.image,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                blogStore.create(blog);
                return blog;
            },

            update: async (args: { where: { id: number }, data: Partial<Blog> }): Promise<Blog | null> => {
                return blogStore.update(args.where.id, args.data) || null;
            },

            delete: async (args: { where: { id: number } }): Promise<Blog | null> => {
                return blogStore.delete(args.where.id) || null;
            },
        },

        comment: {
            findMany: async (args: { where: { blogId: number, postId: number } }): Promise<Comment[]> => {
                return commentStore.getAll().filter(
                    (comment) => comment.blogId === args.where.blogId && comment.postId === args.where.postId
                );
            },

            findFirst: async (args: { where: { blogId: number, postId: number }, orderBy: { id: string }, select: { id: boolean } }): Promise<Partial<Comment> | null> => {
                const all = commentStore.getAll();
                const filtered = Array.from(all).filter(comment =>
                    comment.blogId === args.where.blogId &&
                    comment.postId === args.where.postId
                );
                if (filtered.length === 0) return null;
                filtered.sort((a, b) =>
                    args.orderBy.id === 'asc' ? a.id - b.id : b.id - a.id
                );
                const first = filtered[0];
                if (args.select.id) {
                    return { id: first.id };
                }
                return first;
            },

            create: async (args: { data: Partial<Comment> }): Promise<Comment> => {
                if (!args.data.authorId || typeof args.data.authorId !== "string" || args.data.authorId.trim() === "")
                    throw new Error("Invalid or missing authorId");
                if (!args.data.blogId || typeof args.data.blogId !== "number")
                    throw new Error("Invalid or missing blogId");
                if (!args.data.postId || typeof args.data.postId !== "number")
                    throw new Error("Invalid or missing postId");

                const author = userStore.get(args.data.authorId);
                if (!author)
                    throw new Error("Author not found");

                const blog = blogStore.get(args.data.blogId);
                if (!blog)
                    throw new Error("Blog not found");

                const post = postStore.get(args.data.postId);
                if (!post)
                    throw new Error("Post not found");

                const comment: Comment = {
                    id: args.data.id!,
                    authorId: args.data.authorId!,
                    blogId: args.data.blogId!,
                    postId: args.data.postId!,
                    content: args.data.content!,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                commentStore.create(comment);
                return comment;
            },
        },
        $transaction: async (fn) => fn(mockDb),
    };
};

export const mockDb = createInMemoryDB();
export default mockDb;
