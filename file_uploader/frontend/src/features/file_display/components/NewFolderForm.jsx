import { useState } from "react";
import { create } from "@/api/folders";
import { useFileContext } from "@/contexts/FileContext";

const NewFolderForm = ({ onClose }) => {
    const [folderName, setFolderName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentFolderId, fetchFiles, folders } = useFileContext();

    const handleCreate = async () => {
        const trimmedName = folderName.trim();

        if (!trimmedName) {
            setError("Folder name cannot be empty.");
            return;
        }

        const duplicate = folders.some(
            (f) => f.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setError("A folder with that name already exists.");
            return;
        }

        setLoading(true);
        await create(currentFolderId, trimmedName);
        await fetchFiles();
        setLoading(false);
        onClose();
    };

    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2 w-full sm:w-auto">
            <div className="flex flex-col w-full sm:w-auto">
                <input
                    type="text"
                    className="px-2 py-1 border rounded w-full sm:w-40"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => {
                        setFolderName(e.target.value);
                        setError(null);
                    }}
                />
                {error && (
                    <span className="text-red-600 text-sm mt-1">{error}</span>
                )}
            </div>
            <div className="flex gap-2 mt-1 sm:mt-0">
                <button
                    className="px-3 py-1.5 bg-primary text-white rounded hover:bg-primary-dark transition disabled:opacity-50"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create"}
                </button>
                <button
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewFolderForm;
