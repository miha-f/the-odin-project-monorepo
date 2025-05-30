import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { getFileIcon } from "../utils/getFileIcon";
import { getHumanSize } from "../utils/getHumanSize";

export const FileRow = ({ item, isFolder, onRename, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(item.name);

    const handleSave = () => {
        if (newName.trim() === "" || newName === item.name) {
            // Don't rename if empty or same name
            setIsRenaming(false);
            setNewName(item.name);
            return;
        }
        onRename(item, newName.trim());
        setIsRenaming(false);
    };

    const handleCancel = () => {
        setIsRenaming(false);
        setNewName(item.name);
    };

    return (
        <div className="bg-surface rounded shadow-sm overflow-hidden border-b">
            {/* Grid row */}
            <div
                className="grid grid-cols-2 sm:grid-cols-4 
                    items-center px-4 py-2 cursor-pointer 
                hover:bg-white
                    "
            >
                {/* Name and icon */}
                <div className="flex items-center gap-3 col-span-1 sm:col-span-1">
                    {isFolder ? <FontAwesomeIcon icon={faFolder} /> : getFileIcon(item.mimeType)}

                    {isRenaming ? (
                        <input
                            autoFocus
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSave();
                                else if (e.key === "Escape") handleCancel();
                            }}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                        />
                    ) : isFolder ? (
                        <Link
                            // TODO: Need to make it work from /search/ path
                            to={`${item.name}`}
                            title={item.name}
                            className="truncate hover:underline"
                        >
                            {item.name}
                        </Link>
                    ) : (
                        /* TODO(miha): We have hardoced link... */
                        <a
                            href={`http://localhost:3000/files/${item.id}/download`}
                            title={item.name}
                            className="truncate hover:underline"
                            download
                        >
                            {item.name}
                        </a>
                    )
                    }
                </div>

                {/* Type */}
                <div className="capitalize block sm:block">
                    {isFolder ? "Folder" : "File"}
                </div>

                {/* Size */}
                <div className="block sm:block">{isFolder ? "-" : getHumanSize(item.sizeKb)}</div>

                {/* Modified */}
                <div className="flex justify-between items-center text-sm text-text">
                    {new Date(item.updatedAt).toLocaleString()}
                    {!isRenaming && (
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            onClick={() => setExpanded(!expanded)}
                            className="cursor-pointer"
                        />
                    )}
                </div>
            </div>

            {/* Expanded actions */}
            {
                expanded && !isRenaming && (
                    <div className="px-4 pb-3 pt-1 flex gap-4 text-sm text-blue-600">
                        <button onClick={() => { setIsRenaming(true); setExpanded(false); }}>Rename</button>
                        <button onClick={() => onDelete(item)}>Delete</button>
                    </div>
                )
            }

            {/* Rename buttons */}
            {
                isRenaming && (
                    <div className="px-4 pb-3 pt-1 flex gap-4 text-sm">
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={handleSave}
                            disabled={newName.trim() === ""}
                        >
                            Save
                        </button>
                        <button
                            className="text-gray-600 hover:underline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default FileRow;


