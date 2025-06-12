import { Uuid } from "./common.ts"

export interface Comment {
    id: number;
    authorId: Uuid;
    postId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export const isComment = (obj: any): obj is Comment => {
    return (
        typeof obj.id === 'number' &&
        typeof obj.authorId === 'string' &&
        typeof obj.postId === 'number' &&
        typeof obj.content === 'string' &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date
    );
}
