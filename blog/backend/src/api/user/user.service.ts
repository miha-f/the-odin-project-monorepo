import { internalError, notFound, duplicateResource, badRequest } from "@/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { User } from "./user.model";
import bcrypt from 'bcryptjs';
import { ServiceResult } from '@/types';
import { UserGetAllOptions, UserUpdateData } from "./user.types";
import { hidePassword } from "./user.utils";

export interface UserServiceInterface {
    getById(uuid: string): ServiceResult<User>;
    getByUsername(username: string): ServiceResult<User>;
    getByUsernameWithPasswordHash(username: string): ServiceResult<User>;
    getAll(options: UserGetAllOptions): ServiceResult<User[]>;
    create(username: string, password: string): ServiceResult<User>;
    update(uuid: string, data: UserUpdateData): ServiceResult<User>;
    remove(uuid: string): ServiceResult<User>;
}

export const createUserService = (db: DB): UserServiceInterface => {
    const getById = async (uuid: string): ServiceResult<User> => {
        if (!uuid) return [null, badRequest("Uuid not provided", uuid)];

        let [user, error] = await tryCatch(() => db.user.getById(uuid));
        user = hidePassword(user);
        logger.debug({ user, error }, "UserService.getById");
        if (error) return [null, internalError("UserService.getById db err", error)];
        if (!user) return [null, notFound("UserService.getById user not found")];

        return [user, null];
    };

    // NOTE(miha): Username is unique in the DB.
    const getByUsername = async (username: string): ServiceResult<User> => {
        if (!username) return [null, badRequest("Username not provided", username)];

        let [user, error] = await tryCatch(() => db.user.getByUsername(username));
        user = hidePassword(user);
        logger.debug({ user, error }, "UserService.getByUsername");
        if (error) return [null, internalError("UserService.getByUsername db err", error)];
        if (!user) return [null, notFound("UserService.getByUsername user not found")];

        return [user, null];
    }

    // TODO(miha): Write tests
    const getByUsernameWithPasswordHash = async (username: string): ServiceResult<User> => {
        if (!username) return [null, badRequest("Username not provided", username)];

        let [user, error] = await tryCatch(() => db.user.getByUsername(username));
        logger.debug({ user: hidePassword(user), error }, "UserService.getByUsernameWithPasswordHash");
        if (error) return [null, internalError("UserService.getByUsernameWithPasswordHash db err", error)];
        if (!user) return [null, notFound("UserService.getByUsernameWithPasswordHash user not found")];

        return [user, null];
    }

    const getAll = async (options: UserGetAllOptions): ServiceResult<User[]> => {
        if (!options) return [null, badRequest("Options not provided", options)];

        let [users, error] = await tryCatch(() => db.user.getAll(options));
        users = hidePassword(users);
        logger.debug({ users, error }, "UserService.getAll");
        if (error) return [null, internalError("UserService.getAll db err", error)];
        if (!users) return [null, notFound("UserService.getAll users not found")];

        return [users, null];
    };

    // NOTE(miha): Also used as register.
    const create = async (username: string, password: string): ServiceResult<User> => {
        if (!username) return [null, badRequest("Username not provided", username)];
        if (!password) return [null, badRequest("Password not provided", "******")];

        let [existingUser, existingUserError] = await getByUsername(username);
        existingUser = hidePassword(existingUser);
        logger.debug({ existingUser, existingUserError }, "UserService.create checking if username is taken");
        if (existingUserError && existingUserError.type !== "NotFound") return [null, internalError("UserService.create checking existing user db error", existingUserError)];
        if (existingUser) return [null, duplicateResource("UserService.create duplicate user", { passedUsername: username, existingUsername: existingUser.username })];

        const passwordHash = await bcrypt.hash(password, 10);
        let [user, error] = await tryCatch(() => db.user.create(username, passwordHash));
        user = hidePassword(user);
        logger.debug({ user, error }, "UserService.create new user crreated");
        if (error) return [null, internalError("UserService.create creating user db err", error)];
        if (!user) return [null, notFound("UserService.create user not found")];

        return [user, null];
    };

    const update = async (uuid: string, data: UserUpdateData): ServiceResult<User> => {
        if (!uuid) return [null, badRequest("Uuid not provided", uuid)];

        let [user, error] = await tryCatch(() => db.user.update(uuid, data));
        user = hidePassword(user);
        logger.debug({ user, error }, "UserService.update");
        if (error) return [null, internalError("UserService.update db err", error)];
        if (!user) return [null, notFound("UserService.update user not found")];

        return [user, null];
    };


    const remove = async (uuid: string): ServiceResult<User> => {
        if (!uuid) return [null, badRequest("Uuid not provided", uuid)];

        let [user, error] = await tryCatch(() => db.user.remove(uuid));
        user = hidePassword(user);
        logger.debug({ user, error }, "UserService.remove");
        if (error) return [null, internalError("UserService.remove db err", error)];
        if (!user) return [null, notFound("UserService.remove user not found")];

        return [user, null];
    };

    return {
        getById,
        getByUsername,
        getByUsernameWithPasswordHash,
        getAll,
        create,
        update,
        remove,
    };
};

