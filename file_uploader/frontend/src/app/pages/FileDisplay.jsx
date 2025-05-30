import FileDisplay from "../../features/file_display/FileDisplay";
import Toolbar from "../../features/file_display/Toolbar";
import Breadcrumb from "../../features/file_display/Breadcrumb";
import { useAuth } from "../../features/auth/contexts/AuthContext";

const FileDisplayPage = () => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>
    if (!user) return <p>not logged in...</p>

    return (
        <>
            <div className="overflow-auto h-[calc(100vh-96px)] flex flex-col gap-2">
                <Toolbar />
                <Breadcrumb />
                <FileDisplay />
            </div>
        </>
    );
};

export default FileDisplayPage;
