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

    const getAllByBlogId = async (blogId: number): PostArrayErrorType => {
        const [posts, error] = await tryCatch(() => db.post.findMany(
            { where: { blogId } },
        ));
        if (error) return [null, internalError("Internal error")];
        if (!posts) return [null, notFound("Not found")];
        return [posts, null];
    };

    const getByBlogIdAndPostId = async (blogId: number, postId: number): PostArrayErrorType => {
        const [post, error] = await tryCatch(() => db.post.findMany(
            { where: { blogId, id: postId } },
        ));
        console.log(post, error);
        if (error) return [null, internalError("Internal error")];
        if (!post) return [null, notFound("Not found")];
        return [post, null];
    };

    const create = async (
        authorId: string,
        blogId: number,
        title: string,
        content: string,
        images?: string[],
    ): PostErrorType => {
        // NOTE(miha): Need transaction so we can get id of the latest post of 
        // the given user for given blog.
        const [post, error] = await db.$transaction(async (tx) => {
            const [lastPost, lastPostError] = await tryCatch(() => tx.post.findFirst({
                where: { blogId },
                orderBy: { id: 'desc' },
                select: { id: true },
            }));
            if (lastPostError) return [null, internalError("Internal error")];

            const nextPostId = lastPost ? lastPost.id + 1 : 1;

            const [post, error] = await tryCatch(() => tx.post.create({
                data: {
                    id: nextPostId,
                    authorId: authorId,
                    blogId: blogId,
                    title: title,
                    content: content,
                    images: images,
                }
            }));

            return [post, error]
        });
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
        getAllByBlogId,
        getByBlogIdAndPostId,
    };
};

