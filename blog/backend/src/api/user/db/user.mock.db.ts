import { createInMemoryStore } from "@/utils/inMemoryStore";
import { User, UserDbInterface, UserGetAllOptions, UserUpdateData } from "..";
import { Uuid, DbResult } from "@/types";

export const createUserMockDb = (): UserDbInterface => {
    const userStore = createInMemoryStore<User, Uuid>((user) => user.uuid);

    return {
        getById: async (uuid: Uuid): DbResult<User> => {
            return userStore.get(uuid) || null;
        },

        getByUsername: async (username: string): DbResult<User> => {
            return userStore.getAll().filter(user => user.username === username)[0];
        },

        getAll: async (options: UserGetAllOptions): DbResult<User[]> => {
            return userStore.getAll(options);
        },

        create: async (username: string, passwordHash: string): DbResult<User> => {
            const user: User = {
                uuid: crypto.randomUUID(),
                username: username,
                passwordHash: passwordHash,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            userStore.create(user);
            return user;
        },

        update: async (uuid: Uuid, data: UserUpdateData): DbResult<User> => {
            return userStore.update(uuid, data) || null;
        },

        remove: async (uuid: Uuid): DbResult<User> => {
            return userStore.delete(uuid) || null;
        },
    };
};
