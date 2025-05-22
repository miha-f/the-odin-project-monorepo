import axios from 'axios';

// TODO(miha): Move this to /api/api.js or something.
// TODO(miha): Do the same for file_display feature

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const upload = async (formData) => {
    return axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
    });
};

export const uploadFiles = async (files) => {
    const formData = new FormData();

    files.forEach(({ file, name }) => {
        const renamedFile = new File([file], name, { type: file.type });
        formData.append('files', renamedFile);
    });

    return axios.post(`${API_URL}/folders/root/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    });
};

export default { upload };
