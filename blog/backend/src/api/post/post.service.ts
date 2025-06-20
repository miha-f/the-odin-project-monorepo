import { badRequest, internalError, notFound } from "@/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Post } from "./post.model";
import { ServiceResult, Uuid } from '@/types';
import { PostGetAllOptions, PostUpdateData } from "./post.types";

export interface PostServiceInterface {
    getByIdAndBlogId(id: number, blogId: number): ServiceResult<Post>;
    getAll(options: PostGetAllOptions): ServiceResult<Post[]>;
    getAllByBlogId(blogId: number, options: PostGetAllOptions): ServiceResult<Post[]>;
    create(authorId: Uuid, blogId: number, title: string, content: string, images?: string[]): ServiceResult<Post>;
    // TODO: need to pass authorId so we can verify if action is permitable
    update(id: number, blogId: number, data: PostUpdateData): ServiceResult<Post>;
    remove(id: number, blogId: number): ServiceResult<Post>;
}

export const createPostService = (db: DB): PostServiceInterface => {
    // NOTE(miha): Post is identifed by its blogId and postId. In DB they form
    // composite key.
    const getByIdAndBlogId = async (id: number, blogId: number): ServiceResult<Post> => {
        if (!id) return [null, badRequest("Id not provided", id)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];

        const [post, error] = await tryCatch(() => db.post.getByIdAndBlogId(id, blogId));
        logger.debug({ post, error }, "PostService.getByIdAndBlogId");
        if (error) return [null, internalError("PostService.getByIdAndBlogId db err", error)];
        if (!post) return [null, notFound("PostService.getByIdAndBlogId post not found")];

        return [post, null];
    };

    const getAll = async (options: PostGetAllOptions): ServiceResult<Post[]> => {
        if (!options) return [null, badRequest("Options not provided", options)];

        const [posts, error] = await tryCatch(() => db.post.getAll(options));
        logger.debug({ posts, error }, "PostService.getAll");
        if (error) return [null, internalError("PostService.getAll db err", error)];
        if (!posts) return [null, notFound("PostService.getAll posts not found")];

        return [posts, null];
    };

    const getAllByBlogId = async (blogId: number, options: PostGetAllOptions): ServiceResult<Post[]> => {
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];

        const [posts, error] = await tryCatch(() => db.post.getAllByBlogId(blogId, options));
        logger.debug({ posts, error }, "PostService.getAllByBlogId");
        if (error) return [null, internalError("PostService.getAllByBlogId db err", error)];
        if (!posts) return [null, notFound("PostService.getAllByBlogId posts not found")];

        return [posts, null];
    };

    const create = async (authorId: string, blogId: number, title: string, content: string, images?: string[]): ServiceResult<Post> => {
        if (!authorId) return [null, badRequest("AuthorId not provided", authorId)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];
        if (!title) return [null, badRequest("Title not provided", title)];
        if (!content) return [null, badRequest("Content not provided", content)];
        if (Array.isArray(images) && !images) return [null, badRequest("Images not provided", images)];

        // NOTE(miha): Need transaction so we can get id of the latest post of 
        // the given user for given blog.
        const [post, error] = await db.post.transaction(async (tx) => {
            const [lastPost, lastPostError] = await tryCatch(() => tx.getLatestPostInBlog(blogId));
            logger.debug({ lastPost, lastPostError }, "PostService.create get last");
            if (lastPostError) return [null, internalError("PostService.create last post db err", lastPostError)];

            const nextPostId = lastPost ? lastPost.id + 1 : 1;

            const [post, error] = await tryCatch(() => tx.create(nextPostId, authorId, blogId, title, content, images));

            return [post, error]
        });
        logger.debug({ post, error }, "PostService.create new data");
        if (error) return [null, internalError("PostService.create db err", error)];
        if (!post) return [null, notFound("PostService.create post not found")];

        return [post, null];
    };

    const update = async (id: number, blogId: number, data: PostUpdateData): ServiceResult<Post> => {
        if (!id) return [null, badRequest("Id not provided", id)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];

        const [post, error] = await tryCatch(() => db.post.update(id, blogId, data));
        logger.debug({ post, error }, "PostService.update");
        if (error) return [null, internalError("PostService.update db err", error)];
        if (!post) return [null, notFound("PostService.update post not found")];

        return [post, null];
    };


    const remove = async (id: number, blogId: number): ServiceResult<Post> => {
        if (!id) return [null, badRequest("Id not provided", id)];
        if (!blogId) return [null, badRequest("BlogId not provided", blogId)];

        const [post, error] = await tryCatch(() => db.post.remove(id, blogId));
        logger.debug({ post, error }, "PostService.remove");
        if (error) return [null, internalError("PostService.remove db err", error)];
        if (!post) return [null, notFound("PostService.remove post not found")];

        return [post, null];
    };

    return {
        getByIdAndBlogId,
        getAll,
        getAllByBlogId,
        create,
        update,
        remove,
    };
};
