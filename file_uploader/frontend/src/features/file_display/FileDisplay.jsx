import { useState, useCallback } from "react";
import { FileIcon, ArchiveIcon } from '@radix-ui/react-icons';
import Breadcrumb from "./Breadcrumb";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faFilePdf,
    faFileVideo,
    faFileAudio,
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFileImage,
    faFileCode,
    faFileLines,
    faFileZipper,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect } from "react";
import { getRoot, getFolder } from "../../api/folders";
import { Link, useLocation } from "react-router-dom";
import { useFileContext } from "../../contexts/FileContext";

const getFileIcon = (mimeType) => {
    if (!mimeType) return <FontAwesomeIcon icon={faFile} />;

    if (mimeType.startsWith('image/')) return <FontAwesomeIcon icon={faFileImage} />;
    if (mimeType.startsWith('video/')) return <FontAwesomeIcon icon={faFileVideo} />;
    if (mimeType.startsWith('audio/')) return <FontAwesomeIcon icon={faFileAudio} />;
    if (mimeType.startsWith('text/')) return <FontAwesomeIcon icon={faFileLines} />;

    switch (mimeType) {
        case 'application/pdf':
            return <FontAwesomeIcon icon={faFilePdf} />;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return <FontAwesomeIcon icon={faFileWord} />;
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return <FontAwesomeIcon icon={faFilePowerpoint} />;
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return <FontAwesomeIcon icon={faFileExcel} />;
        case 'application/zip':
        case 'application/x-zip-compressed':
        case 'application/x-rar-compressed':
        case 'application/x-7z-compressed':
        case 'application/x-tar':
            return <FontAwesomeIcon icon={faFileZipper} />;
        case 'application/json':
        case 'application/javascript':
        case 'text/html':
        case 'text/css':
        case 'text/javascript':
            return <FontAwesomeIcon icon={faFileCode} />;
        default:
            return <FontAwesomeIcon icon={faFile} />;
    }
};

const FileDisplay = () => {
    const { files, folders } = useFileContext();

    if (!folders) return null;
    if (!files) return null;

    return (
        <>
            <Breadcrumb />

            <div className="w-full">
                {/* Desktop Table */}
                <div className="hidden sm:block">
                    <table className="w-full table-auto text-left border-separate border-spacing-y-2">
                        <thead className="text-sm text-text">
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Type</th>
                                <th className="px-4 py-2">Size</th>
                                <th className="px-4 py-2">Modified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.map((folder) => (
                                <tr key={folder.id} className="bg-surface rounded shadow-sm">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        <ArchiveIcon />
                                        <Link to={`${folder.name}`} className="hover:underline">
                                            {folder.name}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-2 capitalize">Folder</td>
                                    <td className="px-4 py-2">-</td>
                                    <td className="px-4 py-2">{new Date(folder.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                            {files.map((file) => (
                                <tr key={file.id} className="bg-surface rounded shadow-sm">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {getFileIcon(file.mimeType)}
                                        {file.name}
                                    </td>
                                    <td className="px-4 py-2 capitalize">File</td>
                                    <td className="px-4 py-2">{file.sizeKb}</td>
                                    <td className="px-4 py-2">{new Date(file.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4 pt-4">
                    {folders.map((folder) => (
                        <div
                            key={folder.id}
                            className="flex items-center justify-between p-4 bg-surface rounded shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <ArchiveIcon />
                                <div>
                                    <p className="font-medium">{folder.name}</p>
                                    <p className="text-xs text-text">{new Date(folder.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">Folder</p>
                                <p className="text-xs text-text">-</p>
                            </div>
                        </div>
                    ))}
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-surface rounded shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {getFileIcon(file.mimeType)}
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-text">{new Date(file.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">File</p>
                                <p className="text-xs text-text">{file.sizeKb}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default FileDisplay;
