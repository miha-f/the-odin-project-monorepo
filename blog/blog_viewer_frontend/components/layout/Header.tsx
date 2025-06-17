'use client';

import { Container, Group, Title } from '@mantine/core';
import Link from 'next/link';

export default function Header() {
    return (
        <Container py="md" size={1200}>
            <Group justify="space-between">
                <Link href="/">
                    <Title order={2}>Blogs</Title>
                </Link>
                <Group gap="sm">
                    <Link href="/">Home</Link>
                    <Link href="/">Users</Link>
                    <Link href="/">Blogs</Link>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                </Group>
            </Group>
        </Container>
    );
}
