import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Container, Text, Title, Center, Flex, Image } from '@mantine/core';
import { Blog, Post } from "@/utils/models";
import { formatDistance } from "date-fns";
import Link from "next/link";

export default async function BlogPage({ params }: { params: { blogId: number } }) {
    const { blogId } = await params;
    const { data: blog, error: blogErr } = await tryCatch<Blog>(api.get(`/blogs/${blogId}`));
    const { data: posts, error: postsErr } = await tryCatch<Post[]>(api.get(`/blogs/${blogId}/posts`));

    if (blogErr || postsErr) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load.
                </Text>
            </Center>
        );
    }

    if (!blog || !posts) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    Not found.
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
                        {blog.title}
                    </Title>
                    <Flex direction="column" align="end">
                        <Text size="sm" c="dimmed">
                            Created: {formatDistance(blog.createdAt, new Date(), { addSuffix: true })}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Updated: {formatDistance(blog.updatedAt, new Date(), { addSuffix: true })}
                        </Text>
                    </Flex>
                </Flex>

                <Text c="dimmed">
                    <Link href={`/users/${blog.authorId}`}>
                        Author: {blog.authorId}
                    </Link>
                </Text>

                <Title order={3}>Blog description:</Title>
                {blog.content}

                <Image
                    radius="md"
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
                />

                <Title order={3}>Blog posts:</Title>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/blogs/${blog.id}/posts/${post.id}`}>
                                {post.title}
                            </Link>
                        </li>
                    ))
                    }
                </ul>
            </Flex>
        </Container >
    );
}
