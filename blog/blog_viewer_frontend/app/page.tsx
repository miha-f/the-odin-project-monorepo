import { tryCatch } from "@/utils/tryCatch";
import { Grid, GridCol, Paper, Text, Title, Center, Flex, Image } from '@mantine/core';
import Link from "next/link";
import { fetchHomePageData } from "@/data/fetchHomePageData";

export default async function HomePage() {
    const { data, error } = await tryCatch(fetchHomePageData());

    if (error) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    {(error as Error).message}
                </Text>
            </Center>
        );
    }

    const { blogs, authors } = data;

    // TODO(miha): Make custom HomePageBlogl.ts component for blogs.
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
                                title={authors.get(authorId)?.username || "n/a"}
                                style={{
                                    maxWidth: 150,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Link href={`/users/${authorId}`}>
                                    {authors.get(authorId)?.username || "n/a"}
                                </Link>
                            </Text>
                        </Flex>
                        <Text mt="sm" lineClamp={3}>
                            {content}
                        </Text>
                        <Image
                            radius="md"
                            src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-${Math.floor(Math.random() * 10) + 1}.png`}
                        />
                    </Paper>
                </GridCol>
            ))}
        </Grid>
    );
}
