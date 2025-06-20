import { BlogDbInterface } from "@/api/blog";
import { UserDbInterface } from "@/api/user";
import { PostDbInterface } from "@/api/post";
import { CommentDbInterface } from "@/api/comment";

export interface DB {
    blog: BlogDbInterface;
    user: UserDbInterface;
    post: PostDbInterface;
    comment: CommentDbInterface;
}
