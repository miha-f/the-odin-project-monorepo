import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Text, Title, Center, Flex, Image } from '@mantine/core';
import { Post } from "@/utils/models";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { fetchBlogAuthor } from "@/data/fetchBlogAuthor";

export default async function BlogPage({ params }: { params: { blogId: number } }) {
    const { blogId } = await params;
    const { data: data, error: blogAuthorError } = await tryCatch(fetchBlogAuthor(blogId));
    const { data: posts, error: postsError } = await tryCatch<Post[]>(api.get(`/blogs/${blogId}/posts`));

    const error = blogAuthorError || postsError;
    if (error) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    {(error as Error).message}
                </Text>
            </Center>
        );
    }

    const { blog, author } = data;

    return (
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
                    Author: {author.username}
                </Link>
            </Text>

            <Title order={3}>Blog description:</Title>
            {blog.content}

            <Image
                radius="md"
                src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-${Math.floor(Math.random() * 10) + 1}.png`}
            />

            {/* TODO(miha): Some posts component */}
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
    );
}
