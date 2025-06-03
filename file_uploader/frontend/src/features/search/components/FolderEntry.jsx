import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';

const FileEntry = ({ file }) => {
    return (
        <div>
            <ul className="ml-2">
                <div className="bg-surface rounded shadow-sm overflow-hidden border-b">
                    <div className="grid grid-cols-1 items-center px-4 py-2 cursor-pointer hover:bg-white truncate">
                        {/* TODO(miha): We have hardoced link... */}
                        <a
                            href={`http://localhost:3000/files/${file.id}/download`}
                            title={file.name}
                            className="truncate hover:underline"
                            download
                        >
                            {file.name}
                        </a>
                    </div>
                </div>
            </ul>
        </div>
    );
}

export const FolderEntry = ({ folderPath, files }) => {
    files = files || [];

    // NOTE(miha): We need to remove the user store location and user id from 
    // given path. Returened value starts with /root/... and can be then used
    // in links.
    const removePathPrefix = (path) => {
        return path.slice(path.indexOf("/root"));
    }

    folderPath = removePathPrefix(folderPath);

    return (
        <div className="my-4">

            {/* NOTE(miha): Folder entry */}
            <div className="bg-surface rounded shadow-sm overflow-hidden border-b">
                <div className="grid grid-cols-1 items-center px-4 py-2 cursor-pointer hover:bg-white">
                    <div className="flex items-center gap-3 col-span-1 sm:col-span-1">
                        <FontAwesomeIcon icon={faFolder} />
                        <Link
                            to={`/folders${folderPath}`}
                            title={folderPath}
                            className="truncate hover:underline"
                        >
                            {folderPath}
                        </Link>
                    </div>
                </div >
            </div >

            {/* NOTE(miha): Files entry */}
            <ul className="ml-2">
                {files.map((file) => (
                    <FileEntry key={file.id} file={file} />
                ))}
            </ul>
        </div>
    );
};
