import { Blog, User } from "@/models";

export interface BlogModel {
    findUnique(args: { where: { id: number } }): Promise<Blog | null>;
    findMany(): Promise<Blog[]>;
    create(args: { data: Partial<Blog> }): Promise<Blog>;
    update(args: { where: { id: number }, data: Partial<Blog> }): Promise<Blog | null>;
    delete(args: { where: { id: number } }): Promise<Blog | null>;
}

export interface UserModel {
    findUnique(args: { where: { uuid: string } }): Promise<User | null>;
    findMany(): Promise<User[]>;
    create(args: { data: Partial<User> }): Promise<User>;
    update(args: { where: { uuid: string }, data: Partial<User> }): Promise<User | null>;
    delete(args: { where: { uuid: string } }): Promise<User | null>;
}


export interface DB {
    blog: BlogModel;
    user: UserModel;
}
