import { useLocalSearchParams, Link } from 'expo-router'
import { YStack, XStack, Heading, Text, Image, Spinner, Separator } from 'tamagui'
import { ScrollView } from 'react-native'
import { useBlog } from '@/hooks/useBlog'
import { formatDistance } from 'date-fns'

export default function BlogPage() {
    const { blogId } = useLocalSearchParams<{ blogId: string }>()
    const blogIdNum = parseInt(blogId, 10);
    const { blog, author, posts, loading, error } = useBlog(blogIdNum)

    if (loading) {
        return (
            <YStack f={1} jc="center" ai="center" p="$4">
                <Spinner size="large" />
                <Text mt="$2">Loading blog...</Text>
            </YStack>
        )
    }

    if (error || !blog) {
        return (
            <YStack f={1} jc="center" ai="center" p="$4">
                <Text color="red">{error || 'Failed to load blog'}</Text>
            </YStack>
        )
    }

    return (
        <ScrollView>
            <YStack p="$4" gap="$4">
                <XStack jc="space-between" ai="center">
                    <Heading size="$8">{blog.title}</Heading>
                    <YStack ai="flex-end">
                        <Text fontSize="$2" color="$gray10">
                            Created: {formatDistance(new Date(blog.createdAt), new Date(), { addSuffix: true })}
                        </Text>
                        <Text fontSize="$2" color="$gray10">
                            Updated: {formatDistance(new Date(blog.updatedAt), new Date(), { addSuffix: true })}
                        </Text>
                    </YStack>
                </XStack>

                <Text fontSize="$3" color="$gray10">
                    <Link href={`/users/${blog.authorId}`}>
                        Author: {author?.username || 'Unknown'}
                    </Link>
                </Text>

                <Separator />

                <Heading size="$6">Blog description:</Heading>
                <Text>{blog.content}</Text>

                <Image
                    source={{
                        uri: `https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png`,
                    }}
                    style={{ width: '100%', height: 200, borderRadius: 12 }}
                />

                <Separator />

                <Heading size="$6">Blog posts:</Heading>
                <YStack gap="$2">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blogs/${blog.id}/posts/${post.id}`} asChild>
                            <Text fontSize="$5" color="$blue10">{post.title}</Text>
                        </Link>
                    ))}
                </YStack>
            </YStack>
        </ScrollView>
    )
}
