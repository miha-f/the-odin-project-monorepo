import { useFileContext } from "../../contexts/FileContext";
import { FileRow } from "./components/FileRow";
import { FileListHeader } from "./components/FileListHeader";
import { remove as removeFolder, update as updateFolder } from '@/api/folders';
import { remove as removeFile, update as updateFile } from '@/api/files';

const FileDisplay = () => {
    const { files, folders, fetchFiles } = useFileContext();
    const handleRename = async (item, newName) => {
        const isFolder = !item.mimeType;
        if (isFolder) {
            // TODO(miha): Handle error case
            const { data, error } = await updateFolder(item.id, newName);
        } else {
            // TODO(miha): Handle error case
            const { data, error } = await updateFile(item.id, newName);
        }
        await fetchFiles();
    };

    const handleDelete = async (item) => {
        const isFolder = !item.mimeType;
        if (isFolder) {
            // TODO(miha): Handle error case
            const { data, error } = await removeFolder(item.id);
        } else {
            // TODO(miha): Handle error case
            const { data, error } = await removeFile(item.id);
        }
        await fetchFiles();
    };


    if (!folders) return null;
    if (!files) return null;

    return (
        <div className="w-full">
            <FileListHeader />
            {[...folders]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((folder) => (
                    <FileRow key={folder.id} item={folder} isFolder={true} onRename={handleRename} onDelete={handleDelete} />
                ))}
            {[...files]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((file) => (
                    <FileRow key={file.id} item={file} isFolder={false} onRename={handleRename} onDelete={handleDelete} />
                ))}
        </div>
    );
};

export default FileDisplay;
