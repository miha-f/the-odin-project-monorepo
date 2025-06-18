import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Grid, GridCol, Paper, Text, Title, Center, Flex, Image } from '@mantine/core';
import Link from "next/link";
import { Blog } from "@/utils/models";

export default async function HomePage() {
    const { data: blogs, error } = await tryCatch<Blog[]>(api.get("/blogs"));

    if (error) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load blogs.
                </Text>
            </Center>
        );
    }

    if (!blogs || blogs.length === 0) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    No blogs found.
                </Text>
            </Center>
        );
    }

    return (
        <Grid>
            {blogs.map(({ id, title, content, authorId }) => (
                <GridCol key={id} span={{ base: 12, sm: 6, xl: 4 }}>
                    <Paper shadow="sm" p="md" radius="md" withBorder>
                        <Flex
                            justify="space-between"
                            align="center"
                            py="sm"
                        >
                            <Link href={`/blogs/${id}`}>
                                <Title order={4}>{title}</Title>
                            </Link>
                            <Text
                                size="sm"
                                c="dimmed"
                                title={authorId}
                                style={{
                                    maxWidth: 150,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {authorId}
                            </Text>
                        </Flex>
                        <Text mt="sm" lineClamp={3}>
                            {content}
                        </Text>
                        <Image
                            radius="md"
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
                        />
                    </Paper>
                </GridCol>
            ))}
        </Grid>
    );
}
