'use client'

import { Post, Comment } from "@/utils/models";
import { useAuth } from "@/utils/AuthContext";
import { Text, Title, Flex, Image, Paper } from '@mantine/core';
import { formatDistance } from "date-fns";
import Link from "next/link";
import NewCommentForm from "./NewCommentForm";

interface Props {
    blogId: number
    post: Post
    comments: Comment[]
};

export function PostPage(props: Props) {
    const { user } = useAuth();
    const { blogId, post, comments } = props;

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

            {user && <NewCommentForm blogId={blogId} postId={post.id} />}

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
};
