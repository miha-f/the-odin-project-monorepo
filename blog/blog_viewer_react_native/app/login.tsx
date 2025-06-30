import { useState } from 'react'
import { YStack, XStack, Input, Button, Text, H1 } from 'tamagui'
import { useRouter } from 'expo-router'
import { api } from '@/lib/axiosClient'
import { tryCatch } from '@/utils/tryCatch'
import { useAuth } from '@/utils/AuthContext'

export default function Login() {
    const router = useRouter()
    const { signIn } = useAuth();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    // const { refetch } = useAuth() // if you want same pattern

    const handleLogin = async () => {
        setErrorMessage('')

        const { data, error } = await tryCatch<string>(
            api.post('/auth/login', { username, password })
        )

        if (error || !data) {
            setErrorMessage('Invalid username or password')
            return
        }

        await signIn(data, username);

        router.push('/')
    }

    return (
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
            <H1>Login</H1>

            {errorMessage ? (
                <Text color="red">{errorMessage}</Text>
            ) : null}

            <Input
                placeholder="Username"
                width="100%"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <Input
                placeholder="Password"
                width="100%"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button onPress={handleLogin} w="100%">
                Login
            </Button>

            <XStack gap="$2">
                <Text>Don't have an account?</Text>
                <Text color="$blue10" onPress={() => router.push('/register')}>
                    Register
                </Text>
            </XStack>
        </YStack>
    )
}

