import { DB, } from "@/db/db";
import { createUserMockDb } from "@/api/user";
import { createBlogMockDb } from "@/api/blog";
import { createPostMockDb } from "@/api/post";
import { createCommentMockDb } from "@/api/comment";

export const createInMemoryDB = (): DB => {
    return {
        user: createUserMockDb(),
        post: createPostMockDb(),
        blog: createBlogMockDb(),
        comment: createCommentMockDb(),
        // $transaction: async (fn) => fn(mockDb),
    };
};

export const mockDb = createInMemoryDB();
export default mockDb;
