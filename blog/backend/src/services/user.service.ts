import { AppError, internalError, notFound, duplicateResource, badRequest } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { User, UserIn } from "@/models";
import bcrypt from 'bcryptjs';

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

    const getByUsername = async (username: string): UserErrorType => {
        const [user, error] = await tryCatch(() => db.user.findUnique({ where: { username: username } }));
        if (error) return [null, internalError("Internal error")];
        if (!user) return [null, null]; // TODO(miha): I think it make more sense to return [null, null] on not found - or just skip this step and retur [user, null] - if user is null we reutrn null,null
        return [user, null];
    }

    const getAll = async (): UserArrayErrorType => {
        const [users, error] = await tryCatch(() => db.user.findMany());
        if (error) return [null, internalError("Internal error")];
        if (!users) return [null, notFound("Not found")];
        return [users, null];
    };

    // NOTE(miha): Also used as register.
    const create = async (username: string, password: string): UserErrorType => {
        // TODO(miha): Validatior should be doing this stuff for me... Implement
        // with Zod
        if (!username) return [null, badRequest("Username not provided")];
        if (!password) return [null, badRequest("Password not provided")];
        const [existingUser, existingUserError] = await getByUsername(username);
        if (existingUserError) return [null, internalError("Internal error")];
        if (existingUser) return [null, duplicateResource("Username already exists")];

        const passwordHash = await bcrypt.hash(password, 10);
        const [user, error] = await tryCatch(() => db.user.create({
            data: {
                username: username,
                passwordHash: passwordHash,
            }
        }));

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
        getByUsername,
        getAll,
        create,
        update,
        remove,
    };
};

