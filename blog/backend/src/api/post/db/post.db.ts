import { Post } from "..";
import { Uuid, DbResult } from "@/types";
import { PostGetAllOptions, PostUpdateData } from '..';

export interface PostDbInterface {
    getByIdAndBlogId(id: number, blogId: number): DbResult<Post>;
    getAll(options: PostGetAllOptions): DbResult<Post[]>;
    getAllByBlogId(blogId: number, options: PostGetAllOptions): DbResult<Post[]>;
    getLatestPostInBlog(blogId: number): DbResult<Post>;
    create(id: number, authorId: Uuid, blogId: number, title: string, content: string, images?: string[]): DbResult<Post>;
    update(id: number, blogId: number, data: PostUpdateData): DbResult<Post>;
    remove(id: number, blogId: number): DbResult<Post>;

    transaction<T>(callback: (tx: PostDbInterface) => Promise<T>): Promise<T>;
}
