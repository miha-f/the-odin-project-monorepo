import { Post } from "@/utils/models";
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Container, Text, Title, Center, Flex, Image } from '@mantine/core';
import { formatDistance } from "date-fns";
import Link from "next/link";

export default async function PostPage({ params }: { params: { blogId: number, postId: number } }) {
    const { blogId, postId } = await params;
    const { data: post, error: postErr } = await tryCatch<Post>(api.get(`/blogs/${blogId}/posts/${postId}`));

    if (postErr) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load post.
                </Text>
            </Center>
        );
    }

    if (!post) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    Post not found.
                </Text>
            </Center>
        );
    }

    return (
        <Container>
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

                {/* TODO: Go over all images */}
                <Image
                    radius="md"
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                />

            </Flex>
        </Container >
    );
}
