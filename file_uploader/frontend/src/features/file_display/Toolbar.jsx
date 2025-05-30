import { useState } from 'react';
import { faFolderPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UploadModal from '@/features/file_upload/components/UploadModal';
import NewFolderForm from './components/NewFolderForm';

const Toolbar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNewFolderForm, setShowNewFolderForm] = useState(false);

    return (
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center bg-white dark:bg-surface p-2 sm:p-3 rounded shadow-sm border border-gray-200 dark:border-gray-700">
            {showNewFolderForm ? (
                <NewFolderForm onClose={() => setShowNewFolderForm(false)} />
            ) : (
                <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded hover:bg-primary-dark transition"
                    onClick={() => setShowNewFolderForm(true)}
                >
                    <FontAwesomeIcon icon={faFolderPlus} />
                    <span>New Folder</span>
                </button>
            )}

            <button
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                onClick={() => setIsModalOpen(true)}
            >
                <FontAwesomeIcon icon={faUpload} />
                <span>Upload Files</span>
            </button>
            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Toolbar;
