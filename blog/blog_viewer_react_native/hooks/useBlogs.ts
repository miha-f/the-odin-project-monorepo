import { useState, useCallback } from 'react'
import { api } from '@/lib/axiosClient'
import { tryCatch } from '@/utils/tryCatch'
import { Blog, User } from '@/constants/models'

export function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [authors, setAuthors] = useState<Map<string, User>>(new Map())
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchNextPage = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)

        const { data: newBlogs, error: blogsError } = await tryCatch<Blog[]>(
            api.get(`/blogs?page=${page}&limit=10&sort=createdAt`)
        )

        if (blogsError) {
            setError(blogsError.message || 'Failed to fetch blogs')
            setLoading(false)
            return
        }

        if (!newBlogs || newBlogs.length === 0) {
            setHasMore(false)
            setLoading(false)
            return
        }

        const blogsWithImages = newBlogs.map((b) => ({
            ...b,
            image:
                b.image ||
                'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
        }))

        const authorIds = Array.from(new Set(newBlogs.map(b => b.authorId))).join(',')
        const { data: users } = await tryCatch<User[]>(
            api.get(`/users?ids=${authorIds}`)
        )

        setAuthors(prev => {
            const updated = new Map(prev)
            users?.forEach(u => updated.set(u.uuid, u))
            return updated
        })

        setBlogs(prev => [...prev, ...blogsWithImages])
        setPage(prev => prev + 1)
        setLoading(false)
    }, [loading, hasMore, page])

    return { blogs, authors, loading, error, hasMore, fetchNextPage }
}
