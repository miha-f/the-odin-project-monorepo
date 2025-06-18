'use client'

import { Button, Group, Textarea, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import { api } from "@/lib/axiosClient";
import { tryCatch } from "@/utils/tryCatch";

interface Props {
    blogId: number
    postId: number
};

export default function NewCommentForm(props: Props) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const { blogId, postId } = props;

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            content: '',
        },

        validate: {
            content: (value) => (value.length > 0 ? null : 'Invalid comment'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setErrorMessage("");

        const { data, error } = await tryCatch<Comment>(api.post(`/blogs/${blogId}/posts/${postId}/comments`, values));

        if (error || !data) {
            setErrorMessage("Invalid username or password");
            return;
        }

        router.refresh();
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            {errorMessage && <Text c="red">{errorMessage}</Text>}
            <Textarea
                withAsterisk
                label="Add New Comment"
                placeholder="Input placeholder"
                key={form.key('content')}
                {...form.getInputProps('content')}
            />

            <Group justify="flex-end" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    );
}
