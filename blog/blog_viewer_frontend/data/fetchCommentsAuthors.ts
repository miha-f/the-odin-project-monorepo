import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Comment, User } from "@/utils/models";

const LIMIT = 12;

export async function fetchCommentsAuthors(blogId: number, postId: number): Promise<{ comments: Comment[]; authors: Map<string, User> }> {
    const { data: comments, error: commentsError } = await tryCatch<Comment[]>(api.get(`/blogs/${blogId}/posts/${postId}/comments?limit=${LIMIT}`));
    if (commentsError || !comments) { throw new Error("Failed to fetch comments"); }

    const userIds = Array.from(new Set(comments.map((c) => c.authorId))).join(",");
    const { data: users, error: usersError } = await tryCatch<User[]>(api.get(`/users?limit=${LIMIT}&ids=${userIds}`));
    if (usersError || !users) { throw new Error("Failed to fetch users"); }

    const uuidToUser = new Map<string, User>();
    users.forEach((u) => uuidToUser.set(u.uuid, u));

    return { comments, authors: uuidToUser };
}
