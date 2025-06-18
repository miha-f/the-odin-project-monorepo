import { Post, Comment } from "@/utils/models";
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Text, Center } from '@mantine/core';
import { PostPage } from "@/components/PostPage";

export default async function Page({ params }: { params: { blogId: number, postId: number } }) {
    const { blogId, postId } = await params;
    const { data: post, error: postErr } = await tryCatch<Post>(api.get(`/blogs/${blogId}/posts/${postId}`));
    const { data: comments, error: commentsErr } = await tryCatch<Comment[]>(api.get(`/blogs/${blogId}/posts/${postId}/comments`));

    if (postErr || commentsErr) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load.
                </Text>
            </Center>
        );
    }

    if (!post || !comments || comments.length === 0) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    Not found.
                </Text>
            </Center>
        );
    }

    return (
        <PostPage blogId={blogId} post={post} comments={comments} />
    );
}
