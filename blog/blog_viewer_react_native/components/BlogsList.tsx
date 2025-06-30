import { useEffect } from 'react'
import { Text, XStack, YStack, Card, Button, Image } from 'tamagui'
import { Link } from 'expo-router'
import { FlatList, ActivityIndicator } from 'react-native'
import { useTablet } from '@/hooks/useTablet'
import { Blog } from '@/constants/models'
import { useBlogs } from '@/hooks/useBlogs'

export default function BlogsList() {
    const { blogs, authors, loading, error, fetchNextPage } = useBlogs()
    const { isTablet } = useTablet()

    useEffect(() => {
        fetchNextPage()
    }, [])

    const renderItem = ({ item }: { item: Blog }) => (
        <Card elevate mb="$4" p="$4" f={1}>
            <YStack gap="$4">
                {item.image && (
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: '100%', height: 180, borderRadius: 8 }}
                    />
                )}
                <XStack jc="space-between">
                    <Text fontSize="$6" fontWeight="700">{item.title}</Text>
                    <Text fontSize="$6" fontWeight="700">
                        {authors.get(item.authorId)?.username || 'Unknown'}
                    </Text>
                </XStack>
                <Text color="$gray10" numberOfLines={3}>{item.content}</Text>
                <Link href={`/blogs/${item.id}`} asChild>
                    <Button size="$3" mt="$2">Read more</Button>
                </Link>
            </YStack>
        </Card>
    )

    if (error) {
        return (
            <YStack f={1} jc="center" ai="center">
                <Text color="red">{error}</Text>
            </YStack>
        )
    }

    if (loading && blogs.length === 0) {
        return (
            <YStack f={1} jc="center" ai="center">
                <ActivityIndicator size="large" />
                <Text mt="$2">Loading blogs...</Text>
            </YStack>
        )
    }

    return (
        <YStack f={1} p="$4">
            <FlatList
                data={blogs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={isTablet ? 2 : 1}
                columnWrapperStyle={isTablet ? { justifyContent: 'space-between' } : undefined}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
            />
        </YStack>
    )
}
