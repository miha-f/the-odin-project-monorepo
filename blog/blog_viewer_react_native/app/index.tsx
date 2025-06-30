import { Text, YStack, Button } from 'tamagui'
import { Link } from 'expo-router'

export default function Settings() {
    return (
        <YStack f={1} jc="center" ai="center">
            <Text fontSize={24}>Home Page</Text>
            <Link href="/blogs" asChild>
                <Button mt="$4">Blogs</Button>
            </Link>
        </YStack>
    )
}
