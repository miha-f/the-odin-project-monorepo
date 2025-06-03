import { useLocation } from 'react-router-dom';
import { getByToken } from './api/api';
import { useEffect, useState } from 'react';
import { FolderEntry } from '../search/components/FolderEntry';

const SharedFolderPage = () => {
    const location = useLocation();
    const token = location.pathname.replace(/^\/share\//, "");

    const [folder, setFolder] = useState(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    console.log(token);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getByToken(token);
            if (error) {
                setError(true);
                return;
            }
            console.log(data);
            setFolder(data.folder);
            setLoading(false);
        };

        fetch();
    }, [token]);


    if (loading) return <p>Loading...</p>
    if (error) return <p>Something went wrong...</p>

    console.log("folder: ", folder);

    return (
        <div>
            <h1 className="text-xl">Shared folder</h1>
            <FolderEntry folderPath={folder.path} files={folder.files} />
        </div>
    )
};

export default SharedFolderPage;
