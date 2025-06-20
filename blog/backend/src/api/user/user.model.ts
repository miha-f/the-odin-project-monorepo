import { Uuid } from "@/types"

// NOTE(miha): This is stored in DB.
export interface User {
    uuid: Uuid;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

// NOTE(miha): This is what API expects when creating new user.
// TODO: schema
// export interface UserIn {
//     uuid: Uuid;
//     username: string;
//     password: string;
//     passwordRepeat: string;
//     createdAt: Date;
//     updatedAt: Date;
// };
