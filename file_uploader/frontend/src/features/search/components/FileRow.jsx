import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { getFileIcon } from "@/features/file_display/utils/getFileIcon";
import { getHumanSize } from "@/features/file_display/utils/getHumanSize";

export const FileRow = ({ item, isFolder }) => {

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
                    <Link
                        // TODO: Need to make it work from /search/ path
                        to={`${item.name}`}
                        title={item.name}
                        className="truncate hover:underline"
                    >
                        {item.name}
                    </Link>
                </div>

                {/* Type */}
                <div className="capitalize block sm:block">
                    {isFolder ? "Folder" : "File"}
                </div>

                {/* Size */}
                <div className="block sm:block">{isFolder ? "-" : getHumanSize(item.sizeKb)}</div>
            </div>
        </div >
    );
};

export default FileRow;


