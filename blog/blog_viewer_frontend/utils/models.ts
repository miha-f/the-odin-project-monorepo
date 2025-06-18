
export type Blog = {
    id: number;
    authorId: string;
    title: string;
    content: string;
    image?: string;
    updatedAt: Date;
    createdAt: Date;
};

export type Post = {
    id: number;
    authorId: string;
    blogId: number;
    title: string;
    content: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type Comment = {
    id: number;
    authorId: string;
    blogId: number;
    postId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type User = {
    uuid: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserIn = {
    uuid: string,
    username: string;
    password: string;
    passwordRepeat: string;
    createdAt: Date;
    updatedAt: Date;
};
