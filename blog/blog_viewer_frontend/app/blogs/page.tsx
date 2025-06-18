import { Center, Text, Table, TableTr, TableTh, TableTd, TableThead, TableTbody, TableScrollContainer } from '@mantine/core';
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { Blog } from "@/utils/models";
import { formatDistance } from "date-fns";
import Link from "next/link";

export default async function Page() {
    const { data: blogs, error: blogsErr } = await tryCatch<Blog[]>(api.get(`/blogs`));

    if (blogsErr) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load.
                </Text>
            </Center>
        );
    }

    if (!blogs) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    Not found.
                </Text>
            </Center>
        );
    }

    const rows = blogs.map((blog) => (
        <TableTr key={blog.id}>
            <TableTd><Link href={`/blogs/${blog.id}`}>{blog.id}</Link></TableTd>
            <TableTd><Link href={`/blogs/${blog.id}`}>{blog.title}</Link></TableTd>
            <TableTd><Link href={`/users/${blog.authorId}`}>{blog.authorId}</Link></TableTd>
            <TableTd>{formatDistance(blog.updatedAt, new Date(), { addSuffix: true })}</TableTd>
        </TableTr>
    ));

    return (
        <TableScrollContainer minWidth={500}>
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>Id</TableTh>
                        <TableTh>Blog Title</TableTh>
                        <TableTh>Author</TableTh>
                        <TableTh>Created</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
        </TableScrollContainer>
    );
}
