import { tryCatch } from "@/utils/tryCatch";
import { Text, Center } from '@mantine/core';
import { fetchBlogsAuthors } from "@/data/fetchBlogsAuthors";
import BlogGrid from "@/components/BlogGrid";

export default async function HomePage() {
    const { data, error } = await tryCatch(fetchBlogsAuthors());

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

    return (
        <BlogGrid initialBlogs={blogs} initialAuthors={authors} />
    );
}
