export default function BlogPage({ params }: { params: { id: number } }) {
    const { id } = params;
    return (
        <p>specific blog {id}</p>
    );
}
