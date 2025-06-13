import { AppError, badRequest, internalError, notFound, unauthorized } from "@/errors/errors";
import { logger } from "@/utils/logger";
import { tryCatch } from "@/utils/tryCatch";
import prismaDb from "@/db/prismaDb";
import { DB } from "@/db/db";
import { User } from "@/models/user.model";
import { createUserService } from "@/services/user.service.ts";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO(miha): Get from config
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

type TokenErrorType = Promise<[string | null, AppError | null]>;

const userService = createUserService({ db: prismaDb });

export const createAuthService = ({ db }: { db: DB }) => {
    const login = async (username: string, password: string): TokenErrorType => {
        const [user, userErr] = await userService.getByUsername(username);
        if (userErr) return [null, internalError("error getting user from db")];
        if (!user) return [null, badRequest("user not found")];

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) return [null, unauthorized("password missmatch")];

        const token = jwt.sign({ sub: user.username }, JWT_SECRET, { expiresIn: '1h' });

        return [token, null];
    };

    return {
        login,
    };
};

