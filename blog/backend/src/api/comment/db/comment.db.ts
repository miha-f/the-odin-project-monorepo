import { Comment } from "..";
import { Uuid, DbResult } from "@/types";
import { CommentGetAllOptions } from '..';

export interface CommentDbInterface {
    getAll(postId: number, blogId: number, options: CommentGetAllOptions): DbResult<Comment[]>;
    getLatestCommentInPostInBlog(postId: number, blogId: number): DbResult<Comment>;
    create(id: number, authorId: Uuid, postId: number, blogId: number, content: string): DbResult<Comment>;

    transaction<T>(callback: (tx: CommentDbInterface) => Promise<T>): Promise<T>;
}
