import { Uuid } from "@/types.ts"

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
