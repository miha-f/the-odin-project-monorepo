import { Post } from "@/utils/models";
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Text, Center } from '@mantine/core';
import { PostPage } from "@/components/PostPage";
import { fetchBlogAuthor } from "@/data/fetchBlogAuthor";
import { fetchCommentsAuthors } from "@/data/fetchCommentsAuthors";

export default async function Page({ params }: { params: { blogId: number, postId: number } }) {
    const { blogId, postId } = await params;
    const { data: blogAuthorData, error: blogAuthorError } = await tryCatch(fetchBlogAuthor(blogId));
    const { data: post, error: postError } = await tryCatch<Post>(api.get(`/blogs/${blogId}/posts/${postId}`));
    const { data: commentsAuthorData, error: commentsError } = await tryCatch(fetchCommentsAuthors(blogId, postId));

    const error = blogAuthorError || postError || commentsError;
    if (error) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    {(error as Error).message}
                </Text>
            </Center>
        );
    }

    const { blog, author } = blogAuthorData;
    const { comments, authors: commentsAuthors } = commentsAuthorData;

    return (
        <PostPage author={author} blog={blog} post={post} comments={comments} commentsAuthors={commentsAuthors} />
    );
}
