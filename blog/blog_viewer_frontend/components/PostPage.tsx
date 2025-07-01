'use client'

import { User, Blog, Post, Comment } from "@/utils/models";
import { useAuth } from "@/utils/AuthContext";
import { Text, Title, Flex, Image, Paper } from '@mantine/core';
import { formatDistance } from "date-fns";
import Link from "next/link";
import NewCommentForm from "./NewCommentForm";

interface Props {
    author: User
    blog: Blog
    post: Post
    comments: Comment[]
    commentsAuthors: Map<string, User>
};

export function PostPage(props: Props) {
    const { user } = useAuth();
    const { blog, post, comments, author, commentsAuthors } = props;

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
                <Link href={`/users/${author.uuid}`}>
                    Author: {author.username}
                </Link>
            </Text>

            <Text c="dimmed">
                <Link href={`/blogs/${blog.id}`}>
                    Blog: {blog.title}
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

            {user && <NewCommentForm blogId={blog.id} postId={post.id} />}

            {comments.map((comment) => (
                <Paper key={comment.id} shadow="sm" p="md" radius="md" withBorder>
                    <Flex justify="space-between">
                        <Text>{commentsAuthors.get(comment.authorId)?.username || "n/a"}</Text>
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
};
