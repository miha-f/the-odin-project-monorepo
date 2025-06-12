import { Blog, User, Post, Comment } from "@/models";

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

export interface PostModel {
    findUnique(args: { where: { id: number } }): Promise<Post | null>;
    findMany(): Promise<Post[]>;
    create(args: { data: Partial<Post> }): Promise<Post>;
    update(args: { where: { id: number }, data: Partial<Post> }): Promise<Post | null>;
    delete(args: { where: { id: number } }): Promise<Post | null>;
}

export interface CommentModel {
    findMany(args: { where: { postId: number } }): Promise<Comment[]>;
    create(args: { data: Partial<Comment> }): Promise<Comment>;
}

export interface DB {
    blog: BlogModel;
    user: UserModel;
    post: PostModel;
    comment: CommentModel;
}
