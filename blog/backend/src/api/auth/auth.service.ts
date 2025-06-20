import { badRequest, internalError, unauthorized } from "@/errors";
import { DB } from "@/db/db";
import { logger } from "@/utils/logger";
import { createUserService } from "@/api/user";
import bcrypt from 'bcryptjs';
import { ServiceResult, Token } from "@/types";
import jwt from 'jsonwebtoken';
import { hidePassword } from "../user/user.utils";
import { JWT_SECRET } from "@/config";

export interface AuthServiceInterface {
    login(username: string, password: string): ServiceResult<Token>;
}

export const createAuthService = (db: DB): AuthServiceInterface => {
    const userService = createUserService(db);

    const login = async (username: string, password: string): ServiceResult<Token> => {
        if (!username) return [null, badRequest("Username not provided", username)];
        if (!password) return [null, badRequest("Password not provided", "****")];

        let [user, userErr] = await userService.getByUsernameWithPasswordHash(username);
        logger.debug({ user: hidePassword(user), userErr }, "AuthService.login");
        if (userErr) return [null, internalError("error getting user from db")];
        if (!user) return [null, badRequest("user not found")];

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        logger.debug({ passwordMatch }, "AuthService.login password match");
        if (!passwordMatch) return [null, unauthorized("password missmatch")];

        const token = jwt.sign({ sub: user.uuid }, JWT_SECRET, { expiresIn: '1h' });

        return [token, null];
    };

    return {
        login,
    };
};

