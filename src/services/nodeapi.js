// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// GET request function
export const getApi = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
};

// POST request function
export const postApi = async (endpoint, data = {}) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`POST request to ${endpoint} failed:`, error);
        throw error;
    }
};

export const postApiWithFile = async (endpoint, data = {}, files = {}) => {
    const formData = new FormData();

    // Append normal fields (ensure JSON strings are sent correctly)
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
    });

    // Append cover image
    if (files.cover_image) {
        formData.append("cover_image", files.cover_image);
    }
    if (files.profile_photo) {
        formData.append("profile_photo", files.profile_photo);
    }
    // Append multiple images correctly
    if (files.images) {
        files.images.forEach((image) => {
            formData.append("images", image);
        });
    }

    // Append site seeing images with correct indexing
    if (files.site_seeing) {
        files.site_seeing.forEach(({ sIndex, dIndex, file }) => {
            if (sIndex !== undefined && dIndex !== undefined) {
                formData.append(`site_seeing[${sIndex}][details][${dIndex}][image]`, file);
            } else {
                console.error("Skipping file due to undefined indices:", file);
            }
        });
    }

    // Debugging: Log FormData contents
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`POST request with file to ${endpoint} failed:`, error);
        throw error;
    }
};








// Update API request with file
export const updateApiWithFile = async (endpoint, id, data = {}, files = {}) => {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (files.file) formData.append('file', files.file);
    if (files.icon_file) formData.append('icon_file', files.icon_file);
    if (files.video) formData.append('video_file', files.video);

    try {
        const response = await api.post(`${endpoint}/${id}`, formData, {
            headers: { 'Accept': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error(`Update request with file to ${endpoint}/${id} failed:`, error);
        throw error;
    }
};
