import { useState } from 'react'
import { YStack, XStack, Input, Button, Text, H1 } from 'tamagui'
import { useRouter } from 'expo-router'
import { tryCatch } from '@/utils/tryCatch'
import { api } from '@/lib/axiosClient' // your axios instance with interceptors
import { User } from '@/constants/models'

export default function Register() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const handleRegister = async () => {
        const { data, error } = await tryCatch<User>(api.post("/users", { username, password, passwordRepeat }));

        // TODO(miha): Handle error
        // if (error || !data) {
        //     setErrorMessage("Invalid username or password");
        //     return;
        // }

        router.push('/login')
    }

    return (
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
            <H1>Register</H1>

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

            <Input
                placeholder="Password"
                width="100%"
                value={passwordRepeat}
                onChangeText={setPasswordRepeat}
                secureTextEntry
            />

            <Button onPress={handleRegister} w="100%">Register</Button>

            <XStack gap="$2">
                <Text>Already have an account?</Text>
                <Text color="$blue10" onPress={() => router.push('/login')}>
                    Login
                </Text>
            </XStack>
        </YStack>
    )
}
