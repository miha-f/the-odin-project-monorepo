import prisma from '../db/prisma.js';
import withCatch from '../helpers/withCatch.js';

const dbGetAll = async (client = prisma) => {
    const [error, result] = await withCatch(() => client.file.findMany());
    if (error)
        return { error: "Database error" };
    return { result: result };
};

const dbGetByUuid = async (uuid, client = prisma) => {
    const [error, result] = await withCatch(() => client.file.findUnique({
        where: { id: uuid },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
};

const dbCreate = async (filename, folderUuid, userUuid, size, mimeType, client = prisma) => {
    const [error, result] = await withCatch(() => client.file.create({
        data: {
            name: filename,
            sizeKb: size,
            mimeType: mimeType,
            folderId: folderUuid,
            ownerId: userUuid,
            path: "", // TODO(miha): Remov this when updating prisma schema
        },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

const dbUpdate = async (uuid, data, client = prisma) => {
    const [error, result] = await withCatch(() => client.file.update({
        where: { id: uuid },
        data,
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

const dbDelete = async (uuid, client = prisma) => {
    const [error, result] = await withCatch(() => client.file.delete({
        where: { id: uuid },
    }));
    if (error)
        return { error: "Database error" };
    return { result: result };
}

// TODO(miha): Think how to do FS operations for file.

const fsCreate = async (folderPath, recursive = false) => {
    // const localPath = path.join(process.env.USERS_STORE_DIR, folderPath);
    // const [error, result] = await withCatch(() => fs.mkdir(localPath, { recursive: recursive }));
    // if (error)
    //     return { error: "Filesystem error" };
    // return { result: result };
}

const fsUpdate = async (oldPath, newPath) => {
    // const [error, result] = await withCatch(() => fs.rename(oldPath, newPath));
    // if (error)
    //     return { error: "Filesystem error" };
    // return { result: result };
};

const fsDelete = async (path, recursive = false, force = false) => {
    // const [error, result] = await withCatch(() => fs.rm(path, { recursive: recursive, force: force }));
    // if (error)
    //     return { error: "Filesystem error" };
    // return { result: result };
};


export const createFileService = () => ({
    db: {
        getAll: dbGetAll,
        getByUuid: dbGetByUuid,
        create: dbCreate,
        update: dbUpdate,
        delete: dbDelete,
    },
    fs: {
        create: fsCreate,
        update: fsUpdate,
        delete: fsDelete,
    },

    create: async (data, client = prisma) => {
    },

    update: async (uuid, data, client = prisma) => {
    },

    delete: async (uuid, client = prisma) => {
    },
});
