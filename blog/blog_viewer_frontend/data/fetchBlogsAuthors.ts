import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Blog, User } from "@/utils/models";

const LIMIT = 10;

export async function fetchBlogsAuthors(): Promise<{ blogs: Blog[]; authors: Map<string, User> }> {
    const { data: blogs, error: blogsError } = await tryCatch<Blog[]>(api.get(`/blogs?limit=${LIMIT}`));
    if (blogsError || !blogs) { throw new Error("Failed to fetch blogs"); }

    const userIds = Array.from(new Set(blogs.map((b) => b.authorId))).join(",");
    const { data: users, error: usersError } = await tryCatch<User[]>(api.get(`/users?limit=${LIMIT}&ids=${userIds}`));
    if (usersError || !users) { throw new Error("Failed to fetch users"); }

    const uuidToUser = new Map<string, User>();
    users.forEach((u) => uuidToUser.set(u.uuid, u));

    return { blogs, authors: uuidToUser };
}
