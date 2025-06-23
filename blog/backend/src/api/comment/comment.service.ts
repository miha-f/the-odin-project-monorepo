import { internalError, notFound, badRequest } from "@/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Comment } from "@/api/comment";
import { ServiceResult, Uuid } from "@/types";
import { CommentGetAllOptions } from "./comment.types";

export interface CommentServiceInterface {
    getAll(blogId: number, postId: number, options: CommentGetAllOptions): ServiceResult<Comment[]>;
    create(authorId: Uuid, blogId: number, postId: number, content: string): ServiceResult<Comment>;
}

// export interface CommentDbInterface {
//     getAll(postId: number, blogId: number, options: CommentGetAllOptions): DbResult<Comment[]>;
//     getLatestCommentInPostInBlog(postId: number, blogId: number): DbResult<Comment>;
//     create(id: number, authorId: Uuid, postId: number, blogId: number, content: string): DbResult<Comment>;
// }

export const createCommentService = (db: DB) => {
    const getAll = async (blogId: number, postId: number, options: CommentGetAllOptions): ServiceResult<Comment[]> => {
        if (!postId) return [null, badRequest("PostId not provided", postId)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];
        if (!options) return [null, badRequest("Options not provided", options)];

        const [comments, error] = await tryCatch(() => db.comment.getAll(postId, blogId, options));
        logger.debug({ comments, error }, "CommentService.getAll");
        if (error) return [null, internalError("Internal error")];
        if (!comments) return [[], notFound("Not found")];

        return [comments, null];
    };

    const create = async (authorId: string, blogId: number, postId: number, content: string): ServiceResult<Comment> => {
        if (!authorId) return [null, badRequest("AuthorId not provided", authorId)];
        if (!postId) return [null, badRequest("PostId not provided", postId)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];
        if (!content) return [null, badRequest("comment not provided")];

        const [comment, error] = await db.comment.transaction(async (tx) => {
            const [lastComment, lastCommentError] = await tryCatch(() => tx.getLatestCommentInPostInBlog(postId, blogId));
            logger.debug({ lastComment, lastCommentError }, "CommentService.create get last comment");
            if (lastCommentError) return [null, internalError("error finding last comment")];

            const nextCommentId = lastComment ? lastComment.id + 1 : 1;

            const [comment, error] = await tryCatch(() => db.comment.create(nextCommentId, authorId, postId, blogId, content));

            return [comment, error]
        });
        logger.debug({ comment, error }, "CommentService.create new data");
        if (error) return [null, internalError("error creating new comment")];
        if (!comment) return [null, notFound("Not found")];

        return [comment, null];
    };

    return {
        getAll,
        create,
    };
};

