process.env.NODE_ENV = 'development';
import prisma from './prisma.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const seedUsers = async (n = 5) => {
    const users = [];

    for (let i = 1; i <= n; i++) {
        const passwordHash = await bcrypt.hash("password", 10);

        let user = await prisma.user.create({
            data: {
                username: faker.internet.username(),
                passwordHash: passwordHash,
            }
        });

        const rootFolder = await prisma.folder.create({
            data: {
                name: 'root',
                ownerId: user.id,
                rootOwner: {
                    connect: { id: user.id }
                }
            }
        });

        user = await prisma.user.update({
            where: { id: user.id },
            data: {
                rootFolderId: rootFolder.id
            },
            include: {
                rootFolder: true,
            },
        });

        users.push(user);
    }

    return users;
};

const seedFolders = async (users, n = 5) => {
    const folders = [];
    const userToFolders = new Map();

    for (const user of users)
        userToFolders.set(user.id, [user.rootFolderId]);

    for (let i = 1; i <= n; i++) {
        const user = faker.helpers.arrayElement(users);
        const folderIds = userToFolders.get(user.id);
        if (!folderIds || folderIds.length === 0) continue;
        const parentFolderId = faker.helpers.arrayElement(folderIds);

        const folder = await prisma.folder.create({
            data: {
                name: faker.hacker.noun(),
                ownerId: user.id,
                parentId: parentFolderId,
            },
            include: {
                parent: true,
                subfolders: true,
            },
        });

        folders.push(folder);
        userToFolders.get(user.id).push(folder.id);
    }

    return folders;
};

const seedFiles = async (folders, n = 5) => {
    const files = [];

    for (let i = 1; i <= n; i++) {
        const folder = faker.helpers.arrayElement(folders);

        const file = await prisma.file.create({
            data: {
                name: faker.system.commonFileName(),
                folderId: folder.id,
                ownerId: folder.ownerId,
                sizeKb: faker.number.int({ max: 2_000_000_000 }),
                mimeType: 'text/plain',
                // path: faker.system.filePath(), // TODO(miha): Will need to actually create this on our system....
            }
        });

        files.push(file);
    }

    return files;
};

async function main() {
    const N = 100;
    const users = await seedUsers(N);
    const folders = await seedFolders(users, N * 10);
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

