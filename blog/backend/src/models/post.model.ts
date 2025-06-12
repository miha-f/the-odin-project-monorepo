import { Uuid } from "./common.ts"

export interface Post {
    id: number;
    authorId: Uuid;
    blogId: number;
    title: string;
    content: string;
    images?: string[];
    createdAt: Date;
    updatedAt: Date;
};

export const isPost = (obj: any): obj is Post => {
    return (
        typeof obj.id === 'number' &&
        typeof obj.authorId === 'string' &&
        typeof obj.blogId === 'number' &&
        typeof obj.title === 'string' &&
        typeof obj.content === 'string' &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date
    );
}
