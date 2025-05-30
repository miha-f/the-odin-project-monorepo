process.env.NODE_ENV = 'development';
import prisma from './prisma.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs/promises';

import { createUserService } from '../services/user.js';
import { createFolderService } from '../services/folder.js';
import { createAuthService } from '../services/auth.js';

const UserService = createUserService();
const FolderService = createFolderService();
const AuthService = createAuthService();

const seedUsers = async (n = 5) => {
    const users = [];

    for (let i = 1; i <= n; i++) {
        const { user, rootFolder: _, error } = await AuthService.register(faker.internet.username(), "password");
        users.push(user);
    }

    return users;
};

const seedFolders = async (users, n = 5) => {
    const generateFolderName = () => {
        const adjective = faker.word.adjective();
        const noun = faker.word.noun();
        const suffix = faker.string.alphanumeric(4);
        return `${adjective}-${noun}-${suffix}`;
    }

    const folders = [];
    const userToFolders = new Map();

    for (const user of users)
        userToFolders.set(user.id, [user.rootFolderId]);

    for (let i = 1; i <= n; i++) {
        const user = faker.helpers.arrayElement(users);
        const folderIds = userToFolders.get(user.id);
        const parentFolderId = faker.helpers.arrayElement(folderIds);
        const { folder, path, error } = await FolderService.create(parentFolderId, user.id, generateFolderName());
        folders.push({ ...folder, path: path });
        userToFolders.get(user.id).push(folder.id);
    }

    return folders;
};

const seedFiles = async (folders, n = 5) => {
    const files = [];

    const getMockFiles = async () => {
        const MOCK_FILES_DIR = path.resolve('./src/db/mock_files');
        const filenames = await fs.readdir(MOCK_FILES_DIR);
        const files = [];

        for (const name of filenames) {
            const filePath = path.join(MOCK_FILES_DIR, name);
            const stat = await fs.stat(filePath);
            if (stat.isFile()) {
                files.push({
                    name,
                    size: stat.size,
                    path: filePath,
                });
            }
        }

        return files;
    }

    const extensionToMimeType = (extension) => {
        switch (extension) {
            case ".avi": return 'video/avi';
            case ".mov": return 'video/avi';
            case ".mp4": return 'video/mp4';
            case ".wmv": return 'video/x-ms-wmv';
            case ".webm": return 'video/webm';

            case ".mp3": return 'audio/mpeg3';
            case ".ogg": return 'audio/ogg'; // CARE(miha): Don't really know if there is audio/ogg mime type, but for our app/purposes it works.
            case ".wav": return 'audio/wav';

            case ".doc": return 'application/doc';
            case ".docx": return 'application/doc';
            case ".xls": return 'application/excel';
            case ".xlsx": return 'application/excel';
            case ".ppt": return 'application/powerpoint';
            case ".pdf": return 'application/pdf';
            case ".odt": return 'application/odt';
            case ".ods": return 'application/ods';
            case ".odp": return 'application/odp';
            case ".rtf": return 'application/rtf';

            case ".jpg": return 'image/jpeg';
            case ".jpeg": return 'image/jpeg';
            case ".png": return 'image/png';
            case ".gif": return 'image/gif';
            case ".tiff": return 'image/tiff';
            case ".ico": return 'image/x-icon';
            case ".svg": return 'image/svg+xml';
            case ".webp": return 'image/webp';

            case ".csv": return 'text/csv';
            case ".json": return 'application/json';
            case ".xml": return 'text/xml';
            case ".html": return 'text/html';
            case ".zip": return 'application/zip';

            default: return 'text/plain';
        }
    }

    const mockFiles = await getMockFiles();

    for (let i = 1; i <= n; i++) {
        const folder = faker.helpers.arrayElement(folders);
        const mockFile = faker.helpers.arrayElement(mockFiles);
        const mockFileExtension = path.extname(mockFile.path);
        const name = `${faker.system.commonFileName("removeMe").replace(/\.removeMe$/, '')}${mockFileExtension}`;
        const mimeType = extensionToMimeType(mockFileExtension);

        const file = await prisma.file.create({
            data: {
                name: name,
                folderId: folder.id,
                ownerId: folder.ownerId,
                sizeKb: mockFile.size,
                mimeType: mimeType,
            }
        });

        const src = mockFile.path;
        const dest = path.join(folder.path, name);
        await fs.copyFile(src, dest);

        files.push(file);
    }

    return files;
};

async function main() {
    const N = 100;
    console.log("seeding users");
    const users = await seedUsers(N);
    console.log("seeding folders");
    const folders = await seedFolders(users, N * 10);
    console.log("seeding files");
    const files = await seedFiles(folders, N * 10 * 10);

    console.log('✅ Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

