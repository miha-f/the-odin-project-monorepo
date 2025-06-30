import { Text, YStack, Button } from 'tamagui'
import { Link } from 'expo-router'

export default function Settings() {
    return (
        <YStack f={1} jc="center" ai="center">
            <Text fontSize={24}>Blogs Page</Text>
            <Link href="/" asChild>
                <Button mt="$4">Back to Home</Button>
            </Link>
        </YStack>
    )
}
