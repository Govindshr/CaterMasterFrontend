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

// Protected GET request function

// how to use this 

// const token = localStorage.getItem('authToken');
// const data = await protectedGetApi('/api/users/profile', token);

export const protectedGetApi = async (endpoint, token) => {
    try {
        const response = await api.get(endpoint, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Protected GET request to ${endpoint} failed:`, error);
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

// Protected POST request function

// how to use this

// const token = localStorage.getItem('authToken');
// const payload = { fullName: 'Jane Doe', mobile: '9999999999' };
// const result = await protectedPostApi('/api/users/profile', payload, token);

export const protectedPostApi = async (endpoint, data = {}, token) => {
    try {
        const response = await api.post(endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Protected POST request to ${endpoint} failed:`, error);
        throw error;
    }
};
export const protectedDeleteApi = async (endpoint, token) => {
  try {
    const response = await api.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Protected DELETE request to ${endpoint} failed:`, error);
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

// how to use this protectedPostApiWithFile 

// const token = localStorage.getItem('authToken');
// const data = { title: "My Tour" };
// const files = {
//   cover_image: selectedCoverFile,
//   site_seeing: [
//     { sIndex: 0, dIndex: 0, file: someFile }
//   ]
// };

// const result = await protectedPostApiWithFile('/api/tours', data, files, token);

export const protectedPostApiWithFile = async (endpoint, data = {}, files = {}, token) => {
    const formData = new FormData();

    // Append normal fields
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === "object" ? JSON.stringify(value) : value);
    });

    // Append specific files
    if (files.cover_image) {
        formData.append("cover_image", files.cover_image);
    }
    if (files.profile_photo) {
        formData.append("profile_photo", files.profile_photo);
    }

    // Append array of images
    if (Array.isArray(files.images)) {
        files.images.forEach((image) => {
            formData.append("images", image);
        });
    }

    // Append nested site_seeing images with indices
    if (Array.isArray(files.site_seeing)) {
        files.site_seeing.forEach(({ sIndex, dIndex, file }) => {
            if (sIndex !== undefined && dIndex !== undefined) {
                formData.append(`site_seeing[${sIndex}][details][${dIndex}][image]`, file);
            } else {
                console.error("Skipping file due to undefined indices:", file);
            }
        });
    }

    // Debugging: Optional - log formData
    // for (let pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    // }

    try {
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Protected POST request with file to ${endpoint} failed:`, error);
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


// how to use this protectedUpdateApiWithFile 

// const token = localStorage.getItem('authToken');
// const data = { name: "New name" };
// const files = { icon_file: selectedIcon };

// const res = await protectedUpdateApiWithFile('/api/facilities', '123abc', data, files, token);

export const protectedUpdateApiWithFile = async (endpoint, id, data = {}, files = {}, token) => {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (files.file) formData.append('file', files.file);
    if (files.icon_file) formData.append('icon_file', files.icon_file);
    if (files.video) formData.append('video_file', files.video);

    try {
        const response = await api.post(`${endpoint}/${id}`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Protected update request with file to ${endpoint}/${id} failed:`, error);
        throw error;
    }
};
