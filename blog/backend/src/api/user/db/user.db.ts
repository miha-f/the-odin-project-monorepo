import { User } from "..";
import { DbResult } from "@/types";
import { UserGetAllOptions, UserUpdateData } from '..';

export interface UserDbInterface {
    getById(uuid: string): DbResult<User>;
    getByUsername(username: string): DbResult<User>;
    getAll(options: UserGetAllOptions): DbResult<User[]>;
    create(username: string, passwordHash: string): DbResult<User>;
    update(uuid: string, data: UserUpdateData): DbResult<User>;
    remove(uuid: string): DbResult<User>;
}
