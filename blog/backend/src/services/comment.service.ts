import { AppError, internalError, notFound } from "@/errors/errors";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Comment } from "@/models";

type CommentErrorType = Promise<[Comment | null, AppError | null]>;
type CommentArrayErrorType = Promise<[Comment[] | null, AppError | null]>;

export const createCommentService = ({ db }: { db: DB }) => {
    const getAll = async (postId: number): CommentArrayErrorType => {
        const [comments, error] = await tryCatch(() => db.comment.findMany({ where: { postId } }));
        if (error) return [null, internalError("Internal error")];
        if (!comments) return [null, notFound("Not found")];
        return [comments, null];
    };

    const create = async (postId: number, data: Partial<Comment>): CommentErrorType => {
        const [comment, error] = await tryCatch(() => db.comment.create({ data: { ...data, postId } }));
        if (error) return [null, internalError("Internal error")];
        if (!comment) return [null, notFound("Not found")];
        return [comment, null];
    };

    return {
        getAll,
        create,
    };
};

