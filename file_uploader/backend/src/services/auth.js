import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';
import { createUserService } from './user.js';
import { createFolderService } from './folder.js';

const UserService = createUserService();
const FolderService = createFolderService();

export const createAuthService = () => ({

    me: async () => { },
    register: async () => { },
    login: async () => { },
    logout: async () => { },

    create: async (username, password) => {
        const existing = await UserService.getByUsername(username);
        if (existing)
            return { error: "User exists" };

        const passwordHash = await bcrypt.hash(password, 10);
        const { user, rootFolder } = await prisma.$transaction(async (tx) => {
            let user = await UserService.create({ username: username, passwordHash: passwordHash }, tx);
            const rootFolder = await FolderService.create({ name: 'root', ownerId: user.id }, tx);
            user = await UserService.update(user.id, { rootFolderId: rootFolder.id }, tx);
            return { user, rootFolder };
        });

        return { user, rootFolder };
    },
});
