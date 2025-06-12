import { AppError, internalError, notFound } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Post } from "@/models";

type PostErrorType = Promise<[Post | null, AppError | null]>;
type PostArrayErrorType = Promise<[Post[] | null, AppError | null]>;

export const createPostService = ({ db }: { db: DB }) => {
    const getById = async (id: number): PostErrorType => {
        const [post, error] = await tryCatch(() => db.post.findUnique({ where: { id } }));
        logger.debug({ post, error }, "getById");
        if (error) return [null, internalError("Internal error")];
        if (!post) return [null, notFound("Not found")];
        return [post, null];
    };

    const getAll = async (): PostArrayErrorType => {
        const [posts, error] = await tryCatch(() => db.post.findMany());
        if (error) return [null, internalError("Internal error")];
        if (!posts) return [null, notFound("Not found")];
        return [posts, null];
    };

    const create = async (data: Partial<Post>): PostErrorType => {
        const [post, error] = await tryCatch(() => db.post.create({ data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!post) return [null, notFound("Not found")];
        return [post, null];
    };

    const update = async (id: number, data: Partial<Post>): PostErrorType => {
        const [post, error] = await tryCatch(() => db.post.update({ where: { id: id }, data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!post) return [null, notFound("Not found")];
        return [post, null];
    };


    const remove = async (id: number): PostErrorType => {
        const [post, error] = await tryCatch(() => db.post.delete({ where: { id: id } }));
        if (error) return [null, internalError("Internal error")];
        if (!post) return [null, notFound("Not found")];
        return [post, null];
    };

    return {
        getById,
        getAll,
        create,
        update,
        remove,
    };
};

