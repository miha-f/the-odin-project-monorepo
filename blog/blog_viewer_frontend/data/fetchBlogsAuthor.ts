import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Blog, User } from "@/utils/models";

const LIMIT = 12;

export async function fetchBlogsAuthor(userId: string): Promise<{ blogs: Blog[]; author: User }> {
    const { data: blogs, error: blogsError } = await tryCatch<Blog[]>(api.get(`/blogs?limit=${LIMIT}&authorId=${userId}`));
    if (blogsError || !blogs) { throw new Error("Failed to fetch blogs"); }

    const { data: user, error: userError } = await tryCatch<User[]>(api.get(`/users?limit=${LIMIT}&ids=${userId}`));
    if (userError || !user) { throw new Error("Failed to fetch user"); }

    return { blogs, author: user[0] };
}
