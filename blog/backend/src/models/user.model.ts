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

// NOTE(miha): This is what API returns when requesting user(s).
export interface UserOut {
    uuid: Uuid;
    username: string;
    createdAt: Date;
    updatedAt: Date;
};

export const isUser = (obj: any): obj is User => {
    return (
        typeof obj.uuid === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.passwordHash === 'string' &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date
    );
}

export const isUserIn = (obj: any): obj is User => {
    return (
        typeof obj.uuid === 'string' &&
        typeof obj.username === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.passwordRepeat === 'string' &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date
    );
}
