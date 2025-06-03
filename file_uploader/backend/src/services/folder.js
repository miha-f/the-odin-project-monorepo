import prisma from '../db/prisma.js';
import fs from 'fs/promises';
import path from 'path';
import withCatch from '../helpers/withCatch.js';

const dbGetAll = async (client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.findMany());
    if (error)
        return { error: "Database error" };
    return { result: result };
};

const dbGetRootFolderByUserId = async (userId, client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.findFirst({
        where: { ownerId: userId, name: "root", parentId: undefined },
        include: { files: true, subfolders: true },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
};

const dbGetByUuid = async (uuid, client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.findUnique({
        where: { id: uuid },
        include: { parent: true, files: true, subfolders: { include: { shareLinks: true, } }, },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
};

const dbGetPathByUuid = async (uuid, client = prisma) => {
    let path = [];
    const { error: folderError, result } = await dbGetByUuid(uuid, client);
    if (folderError)
        return { error: "Database error" };
    let folder = result;
    while (folder.parentId) {
        path.push(folder.name);
        const { error: folderError, result } = await dbGetByUuid(folder.parentId, client);
        if (folderError)
            return { error: "Database error" };
        folder = result;
    }
    path.push(folder.name);
    path.push(folder.ownerId);
    // path.push(""); // NOTE(Miha): So we get slash in the front of full path.
    path.push(process.env.USERS_STORE_DIR);
    path = path.reverse();
    return { result: path.join("/") };
};

const dbCreate = async (name, parentId, ownerId, client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.create({
        data: {
            name: name,
            ownerId: ownerId,
            parentId: parentId,
        },
        include: {
            parent: true,
            subfolders: true,
        },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

const dbUpdate = async (uuid, data, client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.update({
        where: { id: uuid },
        data,
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

const dbDelete = async (uuid, client = prisma) => {
    const [error, result] = await withCatch(() => client.folder.delete({
        where: { id: uuid },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

// TODO(miha): It is a little funky that somewhere we need to append USERS_STORE_DIR
//   somewhere we don't want to append it...
const fsCreate = async (folderPath, recursive = false, appendCommonStoreDir = true) => {
    const localPath = appendCommonStoreDir ? path.join(process.env.USERS_STORE_DIR, folderPath) : path.join(folderPath);
    const [error, result] = await withCatch(() => fs.mkdir(localPath, { recursive: recursive }));
    if (error)
        return { error: "Filesystem error" };
    return { result: result };
}

const fsUpdate = async (oldPath, newPath) => {
    const [error, result] = await withCatch(() => fs.rename(oldPath, newPath));
    if (error)
        return { error: "Filesystem error" };
    return { result: result };
};

const fsDelete = async (path, recursive = false, force = false) => {
    const [error, result] = await withCatch(() => fs.rm(path, { recursive: recursive, force: force }));
    if (error)
        return { error: "Filesystem error" };
    return { result: result };
};

// TODO(miha): We have multi-phase operations (craete in DB, create in FS). 
// Introducting new folder status (pending, ready) for folder is the way
// to go. Folder is 'pending' until we create underlying FS structure and then
// we update it to 'ready'. This way if anything goes bad we can always chech
// folder data from db to see if it is ready.
export const createFolderService = () => ({
    db: {
        getAll: dbGetAll,
        getRootFolderByUserId: dbGetRootFolderByUserId,
        getByUuid: dbGetByUuid,
        getPathByUuid: dbGetPathByUuid,
        create: dbCreate,
        update: dbUpdate,
        delete: dbDelete,
    },
    fs: {
        // TODO(miha): How to handle creating already exists folders? 
        // How to handle removing non-existing folders?
        create: fsCreate,
        update: fsUpdate,
        delete: fsDelete,
    },

    create: async (parentFolderUuid, userUuid, folderName) => {
        const { error: dbError, result: dbResult } = await dbCreate(folderName, parentFolderUuid, userUuid);
        if (dbError)
            return { error: "Database error" };

        const { result: fsPath } = await dbGetPathByUuid(dbResult.id);
        const { error: fsError, result: _ } = await fsCreate(fsPath, true, false);

        if (fsError) {
            const [_, dbResult] = await dbDelete(dbResult.id);
            return { error: "Filesystem error" };
        }

        return { folder: dbResult, path: fsPath }
    },

    // TODO(miha): Delete from FS...
    update: async (uuid, data) => {
        const { error, result } = await dbUpdate(uuid, data);
    },


    // TODO(miha): We don't delete from FS here...
    //     await fs.rm(folderPath, { recursive: true, force: true });
    delete: async (uuid) => {

        const levelOrder = async () => {
            const queue = [];
            const levels = [];
            const filesToRemove = [];

            queue.push([uuid, 0]);

            while (queue.length) {
                const [currentFolderId, level] = queue.shift();
                levels.push([currentFolderId, level]);
                // TODO(miha): Handle error case
                const { result: currentFolder, error } = await dbGetByUuid(currentFolderId);

                const currentFiles = currentFolder.files.map((file) => file.id);
                filesToRemove.push(...currentFiles);

                for (const subfolder of currentFolder.subfolders)
                    queue.push([subfolder.id, level + 1]);
            }

            return [levels, filesToRemove];
        };

        const [foldersWithLevels, filesToRemove] = await levelOrder();
        // NOTE(miha): Need to sort folders by its level (depth) in decreasing order.
        //   This way we remove leaf folder first and we won't get foreign key
        //   exists errors.
        const sortedFolders = foldersWithLevels.sort((a, b) => b[1] - a[1]);
        const sortedFolderIds = sortedFolders.map(([id]) => id);
        // NOTE(miha): Need to get path before we delete record from DB.
        // TODO(miha): Handle error
        const { result: rootFolderPath, error: _ } = await dbGetPathByUuid(uuid);

        // TODO(miha): Handle transaction fail
        const [transactionError, transactionResult] = await withCatch(() =>
            prisma.$transaction(async (tx) => {
                await tx.file.deleteMany({
                    where: {
                        id: {
                            in: filesToRemove,
                        },
                    },
                });
                await tx.folder.deleteMany({
                    where: {
                        id: {
                            in: sortedFolderIds,
                        },
                    },
                });
                return "ok";
            }));

        await fs.rm(rootFolderPath, { recursive: true, force: true });
    },
    browsePath: async (userId, pathParts) => {
        const { error: rootFolderError, result: rootFolder } = await dbGetRootFolderByUserId(userId);
        if (rootFolderError)
            return { error: "Database error" };

        let folderName = pathParts.shift();
        if (folderName !== rootFolder.name)
            return { error: "Folder not found" };

        let currFolder = rootFolder;
        while (pathParts.length && currFolder.subfolders.length) {
            const subfolderName = pathParts.shift();
            const subfolder = currFolder.subfolders.find((el) => el.name === subfolderName);

            if (subfolder === undefined)
                return { error: "Folder not found" };

            const { result: result, error } = await dbGetByUuid(subfolder.id);

            if (error)
                return { error: "Folder not found" };

            currFolder = result;
        }

        return { folder: currFolder };
    },
});
