'use client'

import { Button, PasswordInput, Group, Text, TextInput, Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { User } from "@/utils/models";

// TODO: In every page use Page as component name
export default function Page() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            password: '',
            passwordRepeat: '',
        },

        validate: {
            username: (value) => (value.length < 2 ? 'Invalid username' : null),
            password: (value) => (value.length < 2 ? 'Invalid password' : null),
            passwordRepeat: (value, values) => value !== values.password ? 'Password did not match' : null,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setErrorMessage("");

        const { data, error } = await tryCatch<User>(api.post("/users", values));

        if (error || !data) {
            setErrorMessage("Invalid username or password");
            return;
        }

        router.push("/login");
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

                <PasswordInput
                    withAsterisk
                    label="Password Repeat"
                    placeholder="password"
                    key={form.key('passwordRepeat')}
                    {...form.getInputProps('passwordRepeat')}
                />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Register</Button>
                </Group>
            </form>
        </Container>
    );
}
