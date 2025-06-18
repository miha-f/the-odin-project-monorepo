
export default async function UserPage({ params }: { params: { userId: string } }) {
    const { userId } = await params;

    return (
        <p>user page: {userId}</p>
    );
}
