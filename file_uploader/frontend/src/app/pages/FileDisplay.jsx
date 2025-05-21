import FileDisplay from "../../features/file_display/FileDisplay";
import { getMe } from '../../api/auth';
import { useEffect } from 'react';
import { useAuth } from "../../features/auth/contexts/AuthContext";

const FileDisplayPage = () => {

    const { user, loading, logout } = useAuth();


    if (loading) return <p>Loading...</p>
    if (!user) return <p>not logged in...</p>
    console.log(user);

    return (
        <>
            <div className="overflow-auto h-[calc(100vh-96px)]">
                <FileDisplay />
            </div>
        </>
    );
};

export default FileDisplayPage;
