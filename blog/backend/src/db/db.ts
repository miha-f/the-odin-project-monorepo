import { Blog } from "@/models/blog.model";

export interface BlogModel {
    findUnique(args: { where: { id: number } }): Promise<Blog | null>;
    findMany(): Promise<Blog[]>;
    create(args: { data: Partial<Blog> }): Promise<Blog>;
    update(args: { where: { id: number }, data: Partial<Blog> }): Promise<Blog | null>;
    delete(args: { where: { id: number } }): Promise<Blog | null>;
}

export interface DB {
    blog: BlogModel;
}
