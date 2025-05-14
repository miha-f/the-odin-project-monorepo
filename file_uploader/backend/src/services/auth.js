import bcrypt from 'bcryptjs';
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
        if (existing) return { error: "User exists" };

        // TODO(miha): This needs to be an transaction.

        const passwordHash = await bcrypt.hash(password, 10);
        let user = await UserService.create({ username: username, passwordHash: passwordHash });
        const rootFolder = await FolderService.create({ name: 'root', ownerId: user.id });
        user = await UserService.update(user.id, { rootFolderId: rootFolder.id });

        return { user, rootFolder };
    },
});
