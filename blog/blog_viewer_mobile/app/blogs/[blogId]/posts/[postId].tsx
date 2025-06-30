import PostDetail from '@/components/PostDetail';
import { useLocalSearchParams } from 'expo-router'

export default function PostPage() {
    const { blogId, postId } = useLocalSearchParams<{ blogId: string, postId: string }>()
    const blogIdNum = parseInt(blogId, 10);
    const postIdNum = parseInt(postId, 10);

    return (
        <PostDetail blogId={blogIdNum} postId={postIdNum} />
    )
};
