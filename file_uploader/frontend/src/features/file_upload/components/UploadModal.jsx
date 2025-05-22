import { useFileUpload } from '../hooks/useUploadFile';
import { uploadFiles } from '../services/fileService';
import Modal from '../../../components/Modal';
import { useState, useRef, useCallback } from 'react';
import { useFileContext } from '../../../contexts/FileContext';

const UploadModal = ({ isOpen, onClose }) => {
    const { files, addFiles, removeFile, updateFilename, reset } = useFileUpload();
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const { fetchFiles } = useFileContext();

    const handleFileOnChange = (e) => {
        addFiles(e.target.files);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [addFiles]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging)
            setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            await uploadFiles(files);
            await fetchFiles();
            reset();
            onClose();
        } catch (err) {
            console.error('Upload failed', err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileOnChange}
                    className="hidden"
                />
                <p className="text-gray-600">
                    Drag & drop files here, or <span className="text-blue-600 underline">click to browse</span>
                </p>
            </div>

            {files.length > 0 && (
                <p className="text-sm text-gray-500 mb-2">
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                </p>
            )}

            {files.length > 0 && (
                <ul className="space-y-2 my-4 max-h-64 overflow-y-auto">
                    {files.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-2 border-b py-1"
                        >
                            <div className="flex flex-col items-start sm:flex-row sm:gap-2 sm:items-end">
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateFilename(item.id, e.target.value)}
                                    className="border px-2 py-1 flex-grow rounded"
                                />
                                <button
                                    onClick={() => removeFile(item.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex justify-center sm:justify-end gap-2">
                <button onClick={onClose} className="text-gray-600">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={uploading || files.length === 0}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </Modal>
    );
};

export default UploadModal;

