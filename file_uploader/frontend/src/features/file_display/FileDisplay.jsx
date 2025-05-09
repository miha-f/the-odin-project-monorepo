import { useState } from "react";
import { FileIcon, ArchiveIcon } from '@radix-ui/react-icons';
import Breadcrumb from "./Breadcrumb";

const pathStackGlobal = [
    { name: '', id: crypto.randomUUID() },
    { name: 'home', id: crypto.randomUUID() },
    { name: 'my', id: crypto.randomUUID() },
];

const mockFiles = [
    { id: 1, name: 'Photos', type: 'folder', size: '-', modified: '2025-05-01' },
    { id: 2, name: 'Resume.pdf', type: 'file', size: '150KB', modified: '2025-04-20' },
    { id: 3, name: 'Presentation.pptx', type: 'file', size: '2.1MB', modified: '2025-04-18' },
    { id: 4, name: 'Work', type: 'folder', size: '-', modified: '2025-03-28' },
    { id: 5, name: 'invoice-2025.pdf', type: 'file', size: '95KB', modified: '2025-05-05' },
];


const FileDisplay = () => {
    // TODO(miha): What about name 'folderPathStack'
    const [pathStack, setPathStack] = useState(pathStackGlobal);

    return (
        <>
            <Breadcrumb pathStack={pathStack} />

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
                            {mockFiles.map((file) => (
                                <tr key={file.id} className="bg-surface rounded shadow-sm">
                                    <td className="px-4 py-2 flex items-center gap-2">
                                        {file.type === 'folder' ? <ArchiveIcon /> : <FileIcon />}
                                        {file.name}
                                    </td>
                                    <td className="px-4 py-2 capitalize">{file.type}</td>
                                    <td className="px-4 py-2">{file.size}</td>
                                    <td className="px-4 py-2">{file.modified}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4 pt-4">
                    {mockFiles.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-surface rounded shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {file.type === 'folder' ? <ArchiveIcon /> : <FileIcon />}
                                <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-text">{file.modified}</p>
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <p className="capitalize">{file.type}</p>
                                <p className="text-xs text-text">{file.size}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </>
    );
};

export default FileDisplay;
