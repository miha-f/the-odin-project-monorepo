
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
