import bcrypt from 'bcryptjs';
import prisma from '../db/prisma.js';
import path from 'path';
import withCatch from '../helpers/withCatch.js';
import { createUserService } from './user.js';
import { createFolderService } from './folder.js';

const UserService = createUserService();
const FolderService = createFolderService();

export const createAuthService = () => ({
    register: async (username, password) => {
        const existing = await UserService.getByUsername(username);
        if (existing)
            return { error: "User exists" };

        const [transactionError, transactionResult] = await withCatch(() =>
            prisma.$transaction(async (tx) => {
                const passwordHash = await bcrypt.hash(password, 10);
                let user = await UserService.create({ username: username, passwordHash: passwordHash }, tx);
                const rootFolder = await FolderService.db.create({ name: 'root', ownerId: user.id }, tx);
                user = await UserService.update(user.id, { rootFolderId: rootFolder.id }, tx);
                return { user, rootFolder };
            }));

        if (transactionError)
            return { error: "Transaction error" };

        const { user, rootFolder } = transactionResult;

        const rootFolderPath = path.join(process.env.USERS_STORE_DIR, user.id, rootFolder.name);
        const [fsError, _] = await withCatch(() => FolderService.fs.create(rootFolderPath, true));

        if (fsError) {
            await UserService.delete(user.id);
            await FolderService.db.delete(rootFolder.id);
            return { error: "Filesystem error" };
        }

        return { user, rootFolder };
    },
});
