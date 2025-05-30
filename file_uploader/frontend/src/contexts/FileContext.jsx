import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getFolder } from '../api/folders';
import { useLocation } from 'react-router-dom';

const FileContext = createContext(null);

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState([]);
    const [folders, setFolders] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState([]);

    const location = useLocation();

    const fetchFiles = useCallback(async () => {
        // TODO(miha): Handle error case...
        const { data, error } = await getFolder(location.pathname);
        console.log("error: ", error);
        setCurrentFolderId(data.folder.id);
        setFiles(data.folder.files);
        setFolders(data.folder.subfolders);
    }, [location.pathname]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <FileContext.Provider value={{ files, folders, currentFolderId, fetchFiles, currentPath: location.pathname }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => useContext(FileContext);
