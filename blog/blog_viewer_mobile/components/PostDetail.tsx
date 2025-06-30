import React from 'react'
import { ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { YStack, XStack, Text, Image } from 'tamagui'
import { formatDistance } from 'date-fns'
import { usePost } from '@/hooks/usePost'
import { Link } from 'expo-router'
import { useAuth } from '@/utils/AuthContext'
// import NewCommentForm from './NewCommentForm'

interface Props {
    blogId: number
    postId: number
}

export default function PostDetail({ blogId, postId }: Props) {
    const { blog, author, post, comments, commentAuthors, loading, error } = usePost(blogId, postId)
    const { user } = useAuth()

    console.log(user);

    if (loading) {
        return (
            <YStack f={1} jc="center" ai="center" p="$4">
                <ActivityIndicator size="large" />
                <Text mt="$2">Loading post...</Text>
            </YStack>
        )
    }

    if (error || !post || !blog || !author) {
        return (
            <YStack f={1} jc="center" ai="center" p="$4">
                <Text color="red">{error || 'Something went wrong.'}</Text>
            </YStack>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <YStack gap="$4" flex={1}>

                {/* Title + Dates */}
                <XStack jc="space-between" ai="center">
                    <Text fontWeight="700" fontSize={24} flex={1}>
                        {post.title}
                    </Text>
                    <YStack ai="flex-end">
                        <Text color="$gray10" fontSize={12}>
                            Created: {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
                        </Text>
                        <Text color="$gray10" fontSize={12}>
                            Updated: {formatDistance(new Date(post.updatedAt), new Date(), { addSuffix: true })}
                        </Text>
                    </YStack>
                </XStack>

                {/* Author Link */}
                <TouchableOpacity>
                    <Link href={`/users/${blog.authorId}`} asChild>
                        <Text color="$blue10" fontSize={14}>
                            Author: {author.username}
                        </Text>
                    </Link>
                </TouchableOpacity>

                {/* Blog Link */}
                <TouchableOpacity>
                    <Link key={post.id} href={`/blogs/${blog.id}`} asChild>
                        <Text fontSize="$5" color="$blue10">{blog.title}</Text>
                    </Link>
                </TouchableOpacity>

                {/* Post Content */}
                <YStack gap="$2">
                    <Text fontWeight="700" fontSize={18}>
                        Post content:
                    </Text>
                    <Text fontSize={16} color="$gray11">
                        {post.content}
                    </Text>
                </YStack>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                    <YStack gap="$2">
                        <Text fontWeight="700" fontSize={18}>
                            Images:
                        </Text>
                        {post.images.map((imageUrl, index) => (
                            <Image
                                key={index}
                                source={{ uri: imageUrl || 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png' }}
                                style={{ width: '100%', height: 200, borderRadius: 8 }}
                            />
                        ))}
                    </YStack>
                )}

                {/* Comments */}
                <Text fontWeight="700" fontSize={18}>
                    Comments:
                </Text>

                {/* {user && <NewCommentForm blogId={blog.id} postId={post.id} />} */}

                <YStack gap="$3" mt="$2">
                    {comments.map((comment) => (
                        <YStack
                            key={comment.id}
                            borderWidth={1}
                            borderColor="$borderColor"
                            borderRadius={8}
                            p="$3"
                            bg="$background"
                            elevation={1}
                        >
                            <XStack jc="space-between" mb="$2">
                                <Text fontWeight="600">
                                    {commentAuthors.get(comment.authorId)?.username || 'n/a'}
                                </Text>
                                <Text fontSize={12} color="$gray10">
                                    {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                                </Text>
                            </XStack>
                            <Text>{comment.content}</Text>
                        </YStack>
                    ))}
                </YStack>
            </YStack>
        </ScrollView>
    )
}
