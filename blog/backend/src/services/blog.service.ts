import { AppError, internalError, notFound } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { Blog } from "@/models/blog.model";

type BlogErrorType = Promise<[Blog | null, AppError | null]>;

export const createBlogService = ({ db }: { db: DB }) => {
    const getById = async (id: number): BlogErrorType => {
        const [blog, error] = await tryCatch(() => db.blog.findUnique({ where: { id } }));
        if (error) return [null, internalError("Internal error")];
        if (!blog) return [null, notFound("Not found")];
        return [blog, null];
    };

    const getAll = async () => {
        const [blogs, error] = await tryCatch(() => db.blog.findMany());
        if (error) return [null, internalError("Internal error")];
        if (!blogs) return [null, notFound("Not found")];
        return [blogs, null];
    };

    const create = async (data: Partial<Blog>) => {
        const [blogs, error] = await tryCatch(() => db.blog.create({ data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!blogs) return [null, notFound("Not found")];
        return [blogs, null];
    };

    const update = async (id: number, data: Partial<Blog>) => {
        const [blog, error] = await tryCatch(() => db.blog.update({ where: { id: id }, data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!blog) return [null, notFound("Not found")];
        return [blog, null];
    };


    const remove = async (id: number) => {
        const [blog, error] = await tryCatch(() => db.blog.delete({ where: { id: id } }));
        if (error) return [null, internalError("Internal error")];
        if (!blog) return [null, notFound("Not found")];
        return [blog, null];
    };

    return {
        getById,
        getAll,
        create,
        update,
        remove,
    };
};

