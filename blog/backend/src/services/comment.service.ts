import { AppError, internalError, notFound, badRequest } from "@/errors/errors";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Comment } from "@/models";

type CommentErrorType = Promise<[Comment | null, AppError | null]>;
type CommentArrayErrorType = Promise<[Comment[] | null, AppError | null]>;

export const createCommentService = ({ db }: { db: DB }) => {
    const getAll = async (blogId: number, postId: number): CommentArrayErrorType => {
        const [comments, error] = await tryCatch(() => db.comment.findMany({ where: { blogId, postId } }));
        if (error) return [null, internalError("Internal error")];
        if (!comments) return [null, notFound("Not found")];
        return [comments, null];
    };

    const create = async (authorId: string, blogId: number, postId: number, content: string): CommentErrorType => {
        if (!content) return [null, badRequest("comment not provided")];

        const [comment, error] = await db.$transaction(async (tx) => {
            const [lastComment, lastCommentError] = await tryCatch(() => tx.comment.findFirst({
                where: { blogId, postId },
                orderBy: { id: 'desc' },
                select: { id: true },
            }));
            if (lastCommentError) return [null, internalError("error finding last comment")];

            const nextCommentId = lastComment ? lastComment.id + 1 : 1;

            const [comment, error] = await tryCatch(() => db.comment.create({
                data: {
                    id: nextCommentId,
                    authorId: authorId,
                    blogId: blogId,
                    postId: postId,
                    content: content,
                }
            }));

            return [comment, error]
        });
        if (error) return [null, internalError("error creating new comment")];
        if (!comment) return [null, notFound("Not found")];
        return [comment, null];
    };

    return {
        getAll,
        create,
    };
};

