import { badRequest, internalError, notFound } from "@/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Blog } from "./blog.model";
import { ServiceResult, Uuid } from '@/types';
import { BlogGetAllOptions, BlogUpdateData } from "./blog.types";

export interface BlogServiceInterface {
    getById(id: number): ServiceResult<Blog>;
    getAll(options: BlogGetAllOptions): ServiceResult<Blog[]>;
    create(authorId: Uuid, title: string, content: string, image: string | undefined): ServiceResult<Blog>;
    update(id: number, data: BlogUpdateData): ServiceResult<Blog>;
    remove(id: number): ServiceResult<Blog>;
}

export const createBlogService = (db: DB): BlogServiceInterface => {
    return {
        async getById(id: number): ServiceResult<Blog> {
            if (!id) return [null, badRequest("Id not provided", id)];

            const [blog, error] = await tryCatch(() => db.blog.getById(id));
            logger.debug({ blog, error }, "BlogService.getById");
            if (error) return [null, internalError("BlogService.getById db err", error)];
            if (!blog) return [null, notFound("BlogService.getById blog not found")];

            return [blog, null];
        },

        async getAll(options: BlogGetAllOptions): ServiceResult<Blog[]> {
            if (!options) return [null, badRequest("Options not provided", options)];

            const [blogs, error] = await tryCatch(() => db.blog.getAll(options));
            logger.debug({ blogs, error }, "BlogService.getAll");
            if (error) return [null, internalError("BlogService.getAll db err", error)];
            if (!blogs) return [null, notFound("BlogService.getAll blogs not found")];

            return [blogs, null];
        },

        async create(authorId: Uuid, title: string, content: string, image?: string): ServiceResult<Blog> {
            if (!authorId) return [null, badRequest("AuthorId not provided", authorId)];
            if (!title) return [null, badRequest("Title not provided", title)];
            if (!content) return [null, badRequest("Content not provided", content)];
            if (typeof image === 'string' && image.trim() !== "") return [null, badRequest("Image not provided", image)];

            const [blog, error] = await tryCatch(() =>
                db.blog.create(authorId, title, content, image)
            );
            logger.debug({ blog, error }, "BlogService.create");
            if (error) return [null, internalError("BlogService.create db err", error)];
            if (!blog) return [null, notFound("BlogService.create blog not found")];

            return [blog, null];
        },

        // TODO(miha): Check if user is author
        async update(id: number, data: BlogUpdateData): ServiceResult<Blog> {
            if (!id) return [null, badRequest("Id not provided", id)];

            const [existing, existingErr] = await tryCatch(() => db.blog.getById(id));
            if (existingErr) return [null, internalError("BlogService.update searching already existing blog db error", existingErr)];
            if (!existing) return [null, notFound("BlogService.update blog not found")];
            logger.debug({ existing, existingErr }, "BlogService.update checking existing");

            const [blog, error] = await tryCatch(() => db.blog.update(id, data));
            logger.debug({ blog, error }, "BlogService.update new data");
            if (error) return [null, internalError("BlogService.update Could not update blog")];
            if (!blog) return [null, notFound("BlogService.update blog not found")];

            return [blog, null];
        },

        // TODO(miha): Check if user is author
        async remove(id: number): ServiceResult<Blog> {
            if (!id) return [null, badRequest("Id not provided", id)];

            const [existing, existingErr] = await tryCatch(() => db.blog.getById(id));
            if (existingErr) return [null, internalError("BlogService.remove searching already existing blog db error", existingErr)];
            if (!existing) return [null, notFound("BlogService.remove blog not found")];
            logger.debug({ existing, existingErr }, "BlogService.remove checking existing");

            const [blog, error] = await tryCatch(() => db.blog.remove(id));
            logger.debug({ blog, error }, "BlogService.remove new data");
            if (error) return [null, internalError("BlogService.remove Could not remove blog")];
            if (!blog) return [null, notFound("BlogService.remove blog not found")];

            return [blog, null];
        }
    };
}
