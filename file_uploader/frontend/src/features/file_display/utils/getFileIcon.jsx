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

export const getFileIcon = (mimeType) => {
    if (!mimeType) return <FontAwesomeIcon icon={faFile} />;

    if (mimeType.startsWith('image/')) return <FontAwesomeIcon icon={faFileImage} />;
    if (mimeType.startsWith('video/')) return <FontAwesomeIcon icon={faFileVideo} />;
    if (mimeType.startsWith('audio/')) return <FontAwesomeIcon icon={faFileAudio} />;
    if (mimeType.startsWith('text/')) return <FontAwesomeIcon icon={faFileLines} />;

    switch (mimeType) {
        case 'application/pdf':
            return <FontAwesomeIcon icon={faFilePdf} />;
        case 'application/doc':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return <FontAwesomeIcon icon={faFileWord} />;
        case 'application/powerpoint':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return <FontAwesomeIcon icon={faFilePowerpoint} />;
        case 'application/excel':
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

