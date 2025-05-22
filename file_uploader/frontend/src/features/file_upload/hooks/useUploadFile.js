import { useState } from 'react';
import fileService from '../services/fileService';

export const useUploadFile = () => {
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await fileService.upload(formData);
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    return { uploadFile, uploading };
};

export const useFileUpload = () => {
    const [files, setFiles] = useState([]);

    const addFiles = (newFiles) => {
        const filesArray = Array.from(newFiles).map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name
        }));
        setFiles((prev) => [...prev, ...filesArray]);
    };

    const updateFilename = (id, newName) => {
        setFiles((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, name: newName } : item
            )
        );
    };

    const removeFile = (id) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const reset = () => setFiles([]);

    return {
        files,
        addFiles,
        updateFilename,
        removeFile,
        reset,
    };
};
