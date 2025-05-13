const files = [
    {
        uuid: 'file-1',
        name: 'Resume.pdf',
        type: 'application/pdf',
        size: 100_000,
        ownerUuid: 'user-1',
        folderUuid: 'folder-1',
        createdAt: new Date('2024-01-01'),
    },
    {
        uuid: 'file-2',
        name: 'Vacation.jpg',
        type: 'image/jpeg',
        size: 200_000,
        ownerUuid: 'user-1',
        folderUuid: 'folder-1',
        createdAt: new Date('2024-02-01'),
    },
    {
        uuid: 'file-3',
        name: 'Notes.txt',
        type: 'text/plain',
        size: 5_000,
        ownerUuid: 'user-2',
        folderUuid: 'folder-2',
        createdAt: new Date('2024-03-01'),
    },
];

const folders = [
    {
        uuid: 'folder-1',
        name: 'Folder 1',
        parentId: '',
        type: 'application/pdf',
        size: 100_000,
        ownerUuid: 'user-1',
        folderUuid: 'folder-1',
        createdAt: new Date('2024-01-01'),
    },
    {
        uuid: 'file-2',
        name: 'Vacation.jpg',
        type: 'image/jpeg',
        size: 200_000,
        ownerUuid: 'user-1',
        folderUuid: 'folder-1',
        createdAt: new Date('2024-02-01'),
    },
    {
        uuid: 'file-3',
        name: 'Notes.txt',
        type: 'text/plain',
        size: 5_000,
        ownerUuid: 'user-2',
        folderUuid: 'folder-2',
        createdAt: new Date('2024-03-01'),
    },
];

const prismaMock = {
    file: {
        findMany: async () => files,
        findUnique: async ({ where }) =>
            files.find((f) => f.uuid === where.uuid),
        create: async ({ data }) => {
            const newFile = { ...data, uuid: `file-${files.length + 1}`, createdAt: new Date() };
            files.push(newFile);
            return newFile;
        },
        update: async ({ where, data }) => {
            const index = files.findIndex((f) => f.uuid === where.uuid);
            if (index === -1) return null;
            files[index] = { ...files[index], ...data };
            return files[index];
        },
        delete: async ({ where }) => {
            const index = files.findIndex((f) => f.uuid === where.uuid);
            if (index === -1) return null;
            const deleted = files.splice(index, 1)[0];
            return deleted;
        },
    },
};

export default prismaMock;

