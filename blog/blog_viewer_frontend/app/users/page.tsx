import { Center, Text, Table, TableTr, TableTh, TableTd, TableThead, TableTbody, TableScrollContainer } from '@mantine/core';
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";
import { User } from "@/utils/models";
import { formatDistance } from "date-fns";
import Link from "next/link";

export default async function Page() {
    const { data: users, error: usersErr } = await tryCatch<User[]>(api.get(`/users`));

    if (usersErr) {
        return (
            <Center>
                <Text c="red" size="lg" mt="xl">
                    Failed to load.
                </Text>
            </Center>
        );
    }

    if (!users) {
        return (
            <Center>
                <Text size="lg" mt="xl">
                    Not found.
                </Text>
            </Center>
        );
    }

    const rows = users.map((user) => (
        <TableTr key={user.uuid}>
            <TableTd><Link href={`/users/${user.uuid}`}>{user.username}</Link></TableTd>
            <TableTd>{formatDistance(user.updatedAt, new Date(), { addSuffix: true })}</TableTd>
        </TableTr>
    ));

    return (
        <TableScrollContainer minWidth={500}>
            <Table>
                <TableThead>
                    <TableTr>
                        <TableTh>Username</TableTh>
                        <TableTh>Created</TableTh>
                    </TableTr>
                </TableThead>
                <TableTbody>{rows}</TableTbody>
            </Table>
        </TableScrollContainer>
    );
}
