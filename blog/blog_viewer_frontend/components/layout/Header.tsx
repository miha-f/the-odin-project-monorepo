'use client';

import { Container, Group, Title, Text } from '@mantine/core';
import Link from 'next/link';
import { useAuth } from "@/utils/AuthContext";

export default function Header() {
    const { user, loading, logout } = useAuth();

    return (
        <Container py="md" size={1200}>
            <Group justify="space-between">
                <Link href="/">
                    <Title order={2}>Blogs</Title>
                </Link>
                <Group gap="sm">
                    <Link href="/">Home</Link>
                    <Link href="/users">Users</Link>
                    <Link href="/blogs">Blogs</Link>
                    {(loading || !user) ?
                        (
                            <>
                                <Link href="/login">Login</Link>
                                <Link href="/register">Register</Link>
                            </>
                        ) :
                        (
                            <>
                                <Link href={`/users/${user.uuid}`}>{user.username}</Link>
                                <Text onClick={() => logout()}>Logout</Text>
                            </>
                        )
                    }
                </Group>
            </Group>
        </Container>
    );
}
