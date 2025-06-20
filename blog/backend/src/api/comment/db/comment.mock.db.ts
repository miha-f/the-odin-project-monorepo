import { createInMemoryStore } from "@/utils/inMemoryStore";
import { Comment, CommentDbInterface, CommentGetAllOptions } from "..";
import { Uuid, DbResult } from "@/types";

export const createCommentMockDb = (): CommentDbInterface => {
    const commentStore = createInMemoryStore<Comment, number>((comment) => comment.id);

    const db: CommentDbInterface = {
        getAll: async (postId: number, blogId: number, options: CommentGetAllOptions): DbResult<Comment[]> => {
            return commentStore.getAll(options).filter(c => c.postId === postId && c.blogId === blogId);
        },

        getLatestCommentInPostInBlog: async (postId: number, blogId: number): DbResult<Comment> => {
            const result = commentStore.getAll().filter(c => c.postId === postId && c.blogId === blogId).sort((p1, p2) => p2.id - p1.id);
            return result ? result[0] : null;
        },

        create: async (id: number, authorId: Uuid, postId: number, blogId: number, content: string): DbResult<Comment> => {
            const comment: Comment = {
                id: id,
                authorId: authorId,
                blogId: blogId,
                postId: postId,
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            commentStore.create(comment);
            return comment;
        },

        transaction: async <T>(callback: (tx: CommentDbInterface) => Promise<T>): Promise<T> => {
            return await callback(db);
        }
    };

    return db;
};
