import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Blog, User } from "@/utils/models";

export async function fetchBlogAuthor(blogId: number): Promise<{ blog: Blog; author: User }> {
    const { data: blog, error: blogError } = await tryCatch<Blog>(api.get(`/blogs/${blogId}`));
    if (blogError || !blog) { throw new Error("Failed to fetch blogs"); }

    const userId = blog.authorId;
    const { data: author, error: authorError } = await tryCatch<User[]>(api.get(`/users?ids=${userId}`));
    if (authorError || !author || author.length !== 1) { throw new Error("Failed to fetch users"); }

    return { blog, author: author[0] };
}
