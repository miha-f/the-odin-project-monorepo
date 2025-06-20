import { Uuid } from "@/types"

export interface Blog {
    id: number;
    authorId: Uuid;
    title: string;
    content: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
};
