import { AppError, internalError, notFound } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import { DB } from "@/db/db";
import { User } from "@/models/user.model";

type AuthErrorType = Promise<[Auth | null, AppError | null]>;
type UserErrorType = Promise<[User | null, AppError | null]>;

export const createBlogService = ({ db }: { db: DB }) => {
    const getCurrentUser = async (): AuthErrorType => {
        // decode JWT token
        return [null, null]
    };

    const login = async (): UserErrorType => {
        return [null, null]
    };

    const logout = async (): Promise<AppError | null> => {
        return null
    };

    return {
        getCurrentUser,
        login,
        logout,
    };
};

