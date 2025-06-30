// import { useEffect, useState } from 'react'
// import { api } from '@/lib/axiosClient'
// import { tryCatch } from '@/utils/tryCatch'
// import { Blog, Post, User, Comment } from '@/constants/models'
//
// const LIMIT = 20;
//
// async function fetchCommentsAuthors(blogId: number, postId: number): Promise<{ comments: Comment[]; authors: Map<string, User> }> {
//     const { data: comments, error: commentsError } = await tryCatch<Comment[]>(api.get(`/blogs/${blogId}/posts/${postId}/comments?limit=${LIMIT}`));
//     if (commentsError || !comments) { throw new Error("Failed to fetch comments"); }
//
//     const userIds = Array.from(new Set(comments.map((c) => c.authorId))).join(",");
//     const { data: users, error: usersError } = await tryCatch<User[]>(api.get(`/users?limit=${LIMIT}&ids=${userIds}`));
//     if (usersError || !users) { throw new Error("Failed to fetch users"); }
//
//     const uuidToUser = new Map<string, User>();
//     users.forEach((u) => uuidToUser.set(u.uuid, u));
//
//     return { comments, authors: uuidToUser };
// }
//
// async function fetchBlogAuthor(blogId: number): Promise<{ blog: Blog; author: User }> {
//     const { data: blog, error: blogError } = await tryCatch<Blog>(api.get(`/blogs/${blogId}`));
//     if (blogError || !blog) { throw new Error("Failed to fetch blogs"); }
//
//     const userId = blog.authorId;
//     const { data: author, error: authorError } = await tryCatch<User[]>(api.get(`/users?ids=${userId}`));
//     if (authorError || !author || author.length !== 1) { throw new Error("Failed to fetch users"); }
//
//     return { blog, author: author[0] };
// }
//
// export function usePost(blogId: number, postId: number) {
//     const [blog, setBlog] = useState<Blog | null>(null)
//     const [post, setPost] = useState<Post | null>(null)
//     const [author, setAuthor] = useState<User | null>(null)
//     const [comments, setComments] = useState<Comment[]>([])
//     const [commentAuthors, setCommentAuthors] = useState<Map<string, User>>(new Map())
//
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//
//     useEffect(() => {
//         if (!blogId) return
//
//         const fetchData = async () => {
//             setLoading(true)
//
//             const { data: blogData, error: blogError } = await tryCatch(
//                 fetchBlogAuthor(blogId)
//             )
//             const { data: postData, error: postError } = await tryCatch<Post>(
//                 api.get(`/blogs/${blogId}/posts/${postId}`)
//             )
//
//             const { data: commentsData, error: commentsError } = await tryCatch(fetchCommentsAuthors(blogId, postId));
//
//             if (blogError || postError || commentsError) {
//                 setError(blogError?.message || postError?.message || commentsError?.message || 'Failed to load blog')
//             }
//
//             if (blogData) {
//                 setBlog(blogData.blog)
//                 setAuthor(blogData.author)
//             }
//
//             if (postData) {
//                 setPost(postData)
//             }
//
//             if (commentsData) {
//                 setComments(commentsData.comments);
//                 setCommentAuthors(commentsData.authors);
//             }
//
//             setLoading(false)
//         }
//
//         fetchData()
//     }, [blogId])
//
//     return { blog, author, post, loading, error, comments, commentAuthors }
// }


import { useEffect, useState } from 'react'
import { api } from '@/lib/axiosClient'
import { tryCatch } from '@/utils/tryCatch'
import { Blog, Post, User, Comment } from '@/constants/models'

const LIMIT = 20

// ---------------------------
// HELPERS
// ---------------------------

async function fetchBlogAndAuthor(blogId: number) {
    const { data: blog, error: blogError } = await tryCatch<Blog>(
        api.get(`/blogs/${blogId}`)
    )
    if (blogError || !blog) {
        throw new Error('Failed to fetch blog')
    }

    const { data: users, error: userError } = await tryCatch<User[]>(
        api.get(`/users?ids=${blog.authorId}`)
    )
    if (userError || !users || users.length !== 1) {
        throw new Error('Failed to fetch blog author')
    }

    return { blog, author: users[0] }
}

async function fetchPost(blogId: number, postId: number) {
    const { data: post, error: postError } = await tryCatch<Post>(
        api.get(`/blogs/${blogId}/posts/${postId}`)
    )
    if (postError || !post) {
        throw new Error('Failed to fetch post')
    }
    return post
}

async function fetchCommentsAndAuthors(blogId: number, postId: number) {
    const { data: comments, error: commentsError } = await tryCatch<Comment[]>(
        api.get(`/blogs/${blogId}/posts/${postId}/comments?limit=${LIMIT}`)
    )
    if (commentsError || !comments) {
        throw new Error('Failed to fetch comments')
    }

    const userIds = Array.from(new Set(comments.map(c => c.authorId))).join(',')
    const { data: users, error: usersError } = await tryCatch<User[]>(
        api.get(`/users?limit=${LIMIT}&ids=${userIds}`)
    )
    if (usersError || !users) {
        throw new Error('Failed to fetch comment authors')
    }

    const authorsMap = new Map<string, User>()
    users.forEach(u => authorsMap.set(u.uuid, u))

    return { comments, authors: authorsMap }
}

// ---------------------------
// HOOK
// ---------------------------

export function usePost(blogId: number, postId: number) {
    const [blog, setBlog] = useState<Blog | null>(null)
    const [author, setAuthor] = useState<User | null>(null)
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentAuthors, setCommentAuthors] = useState<Map<string, User>>(new Map())

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!blogId || !postId) return

        const fetchAll = async () => {
            setLoading(true)
            try {
                const [blogAuthorData, postData, commentsData] = await Promise.all([
                    fetchBlogAndAuthor(blogId),
                    fetchPost(blogId, postId),
                    fetchCommentsAndAuthors(blogId, postId)
                ])

                setBlog(blogAuthorData.blog)
                setAuthor(blogAuthorData.author)
                setPost({ ...postData, images: [""] })
                setComments(commentsData.comments)
                setCommentAuthors(commentsData.authors)

            } catch (err: any) {
                setError(err.message || 'Unknown error')
            } finally {
                setLoading(false)
            }
        }

        fetchAll()
    }, [blogId, postId])

    return { blog, author, post, comments, commentAuthors, loading, error }
}
