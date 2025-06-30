import { useEffect, useState } from 'react'
import { api } from '@/lib/axiosClient'
import { tryCatch } from '@/utils/tryCatch'
import { Blog, Post, User } from '@/constants/models'

async function fetchBlogAuthor(blogId: number): Promise<{ blog: Blog; author: User }> {
    const { data: blog, error: blogError } = await tryCatch<Blog>(api.get(`/blogs/${blogId}`));
    if (blogError || !blog) { throw new Error("Failed to fetch blogs"); }

    const userId = blog.authorId;
    const { data: author, error: authorError } = await tryCatch<User[]>(api.get(`/users?ids=${userId}`));
    if (authorError || !author || author.length !== 1) { throw new Error("Failed to fetch users"); }

    return { blog, author: author[0] };
}

export function useBlog(blogId: number) {
    const [blog, setBlog] = useState<Blog | null>(null)
    const [author, setAuthor] = useState<User | null>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!blogId) return

        const fetchData = async () => {
            setLoading(true)

            const { data, error: blogError } = await tryCatch(
                fetchBlogAuthor(blogId)
            )
            const { data: postsData, error: postsError } = await tryCatch<Post[]>(
                api.get(`/blogs/${blogId}/posts`)
            )

            if (blogError || postsError) {
                setError(blogError?.message || postsError?.message || 'Failed to load blog')
            }

            if (data) {
                setBlog(data.blog)
                setAuthor(data.author)
            }

            if (postsData) {
                setPosts(postsData)
            }

            setLoading(false)
        }

        fetchData()
    }, [blogId])

    return { blog, author, posts, loading, error }
}
