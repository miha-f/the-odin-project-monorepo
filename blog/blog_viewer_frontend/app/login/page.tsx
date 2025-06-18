'use client'

import { Button, PasswordInput, Group, Text, TextInput, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { useAuth } from "@/utils/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const { refetch } = useAuth();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
        },

        validate: {
            username: (value) => (value.length < 2 ? 'Invalid username' : null),
            password: (value) => (value.length < 2 ? 'Invalid password' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setErrorMessage("");

        const { data, error } = await tryCatch<string>(api.post("/auth/login", values));

        if (error || !data) {
            setErrorMessage("Invalid username or password");
            return;
        }

        // TODO: maybe use some hook or someting to save token state
        localStorage.setItem("token", data);
        await refetch();
        router.push("/");
    };

    return (
        <Container size="xs">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                {errorMessage && <Text c="red">{errorMessage}</Text>}
                <TextInput
                    withAsterisk
                    label="Username"
                    placeholder="JohnDoe13"
                    key={form.key('username')}
                    {...form.getInputProps('username')}
                />

                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="password"
                    key={form.key('password')}
                    {...form.getInputProps('password')}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Login</Button>
                </Group>
            </form>
        </Container>
    );
}
