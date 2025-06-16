import { Uuid } from "./common.ts"

// NOTE(miha): This is stored in DB.
export interface User {
    uuid: Uuid;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

// NOTE(miha): This is what API expects when creating new user.
export interface UserIn {
    uuid: Uuid;
    username: string;
    password: string;
    passwordRepeat: string;
    createdAt: Date;
    updatedAt: Date;
};
