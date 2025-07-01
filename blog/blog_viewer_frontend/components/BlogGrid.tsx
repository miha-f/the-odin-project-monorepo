'use client';

import {
    Grid,
    GridCol,
    Paper,
    Text,
    Title,
    Center,
    Flex,
    Image,
    Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import Link from 'next/link';
import { Blog, User } from '@/utils/models';
import { api } from '@/lib/axiosClient';
import { tryCatch } from '@/utils/tryCatch';

type Props = {
    initialBlogs: Blog[];
    initialAuthors: Map<string, User>;
};

export default function BlogGrid({ initialBlogs, initialAuthors }: Props) {
    const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
    const [authors, setAuthors] = useState<Map<string, User>>(initialAuthors);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // const loaderRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: null,
        threshold: 0.5,
    });

    useEffect(() => {
        if (entry?.isIntersecting && !loading && hasMore) {
            fetchNextPage();
        }
    }, [entry]);

    async function fetchNextPage() {
        setLoading(true);
        const { data, error } = await tryCatch<Blog[]>(api.get(`/blogs?page=${page}&limit=10&sort=createdAt`));
        setLoading(false);

        if (error || !data || data.length === 0) {
            setHasMore(false);
            return;
        }

        const newBlogs: Blog[] = data;
        const authorIds = Array.from(new Set(newBlogs.map(b => b.authorId))).join(',');
        const { data: users } = await tryCatch<User[]>(api.get(`/users?ids=${authorIds}`));

        const newAuthors = new Map(authors);
        users?.forEach((u) => newAuthors.set(u.uuid, u));

        setBlogs((prev) => {
            const ids = new Set(prev.map(b => b.id));
            const deduped = newBlogs.filter(b => !ids.has(b.id));
            return [...prev, ...deduped];
        });
        setAuthors(newAuthors);
        setPage((prev) => prev + 1);
    }

    return (
        <>
            <Grid>
                {blogs.map(({ id, title, content, authorId }) => (
                    <GridCol key={id} span={{ base: 12, sm: 6, xl: 4 }}>
                        <Paper shadow="sm" p="md" radius="md" withBorder>
                            <Flex justify="space-between" align="center" py="sm">
                                <Link href={`/blogs/${id}`}>
                                    <Title order={4}>{title}, {id}</Title>
                                </Link>
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    title={authors.get(authorId)?.username || 'n/a'}
                                    style={{
                                        maxWidth: 150,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Link href={`/users/${authorId}`}>
                                        {authors.get(authorId)?.username || 'n/a'}
                                    </Link>
                                </Text>
                            </Flex>
                            <Text mt="sm" lineClamp={3}>
                                {content}
                            </Text>
                            <Image
                                radius="md"
                                src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-${3}.png`}
                            />
                        </Paper>
                    </GridCol>
                ))}
            </Grid>

            {hasMore && (
                <Center mt="lg" ref={ref}>
                    {loading ? <Loader /> : <Text>Loading more...</Text>}
                </Center>
            )}
        </>
    );
}
