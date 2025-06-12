import { Uuid } from "./common.ts"

export interface Blog {
    id: number;
    authorId: Uuid;
    title: string;
    content: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
};

export const isBlog = (obj: any): obj is Blog => {
    return (
        typeof obj.id === 'number' &&
        typeof obj.authorId === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.content === 'string' &&
        obj.createdAt instanceof Date &&
        obj.updatedAt instanceof Date
    );
}
