import { AppError, internalError, notFound } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { User } from "@/models";

type UserErrorType = Promise<[User | null, AppError | null]>;
type UserArrayErrorType = Promise<[User[] | null, AppError | null]>;

export const createUserService = ({ db }: { db: DB }) => {
    const getById = async (uuid: string): UserErrorType => {
        const [user, error] = await tryCatch(() => db.user.findUnique({ where: { uuid } }));
        logger.debug({ user, error }, "getById");
        if (error) return [null, internalError("Internal error")];
        if (!user) return [null, notFound("Not found")];
        return [user, null];
    };

    const getAll = async (): UserArrayErrorType => {
        const [users, error] = await tryCatch(() => db.user.findMany());
        if (error) return [null, internalError("Internal error")];
        if (!users) return [null, notFound("Not found")];
        return [users, null];
    };

    const create = async (data: Partial<User>): UserErrorType => {
        const [user, error] = await tryCatch(() => db.user.create({ data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!user) return [null, notFound("Not found")];
        return [user, null];
    };

    const update = async (uuid: string, data: Partial<User>): UserErrorType => {
        const [user, error] = await tryCatch(() => db.user.update({ where: { uuid: uuid }, data: data }));
        if (error) return [null, internalError("Internal error")];
        if (!user) return [null, notFound("Not found")];
        return [user, null];
    };


    const remove = async (uuid: string): UserErrorType => {
        const [user, error] = await tryCatch(() => db.user.delete({ where: { uuid: uuid } }));
        if (error) return [null, internalError("Internal error")];
        if (!user) return [null, notFound("Not found")];
        return [user, null];
    };

    return {
        getById,
        getAll,
        create,
        update,
        remove,
    };
};

