import { Post, Comment } from "@/utils/models";
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Text, Title, Center, Flex, Image, Paper } from '@mantine/core';
import { formatDistance } from "date-fns";
import Link from "next/link";

export default async function PostPage({ params }: { params: { blogId: number, postId: number } }) {
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
        <Flex direction="column" gap={8}>
            <Flex
                justify="space-between"
                align="center"
                py="sm"
            >
                <Title order={1}>
                    {post.title}
                </Title>
                <Flex direction="column" align="end">
                    <Text size="sm" c="dimmed">
                        Created: {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
                    </Text>
                    <Text size="sm" c="dimmed">
                        Updated: {formatDistance(post.updatedAt, new Date(), { addSuffix: true })}
                    </Text>
                </Flex>
            </Flex>

            <Text c="dimmed">
                <Link href={`/users/${post.authorId}`}>
                    Author: {post.authorId}
                </Link>
            </Text>

            <Text c="dimmed">
                <Link href={`/blogs/${blogId}`}>
                    Blog: {blogId}
                </Link>
            </Text>

            <Title order={3}>Post content:</Title>
            {post.content}


            {post.images && Array.isArray(post.images) && post.images.length > 0 && (
                <>
                    <Title order={3}>Images:</Title>
                    <div>
                        {post.images.map((imageUrl, index) => (
                            <Image
                                key={index}
                                radius="md"
                                src={imageUrl || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"}
                            />
                        ))}
                    </div>
                </>
            )}

            <Title order={3}>Comments:</Title>

            {comments.map((comment) => (
                <Paper key={comment.id} shadow="sm" p="md" radius="md" withBorder>
                    <Flex justify="space-between">
                        <Text>{comment.authorId}</Text>
                        <Text>
                            Created: {formatDistance(comment.createdAt, new Date(), { addSuffix: true })}
                        </Text>
                    </Flex>
                    <Text>
                        {comment.content}
                    </Text>
                </Paper>
            ))}


        </Flex>
    );
}
