import { Uuid } from "@/types.ts"

export interface Comment {
    id: number;
    authorId: Uuid;
    blogId: number;
    postId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};
