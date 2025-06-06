// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Generic GET
export const getApi = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`GET ${endpoint} failed`, error);
    throw error;
  }
};


// Generic POST
export const postApi = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(`POST ${endpoint} failed`, error);
    throw error;
  }
};


// Generic PUT
export const putApi = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`PUT ${endpoint} failed`, error);
    throw error;
  }
};

// Generic DELETE
export const deleteApi = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error(`DELETE ${endpoint} failed`, error);
    throw error;
  }
};

// File Upload (optional)
export const postApiWithFile = async (endpoint, data = {}, files = {}) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  Object.entries(files).forEach(([key, file]) => {
    if (Array.isArray(file)) {
      file.forEach((f) => formData.append(key, f));
    } else {
      formData.append(key, file);
    }
  });

  try {
    const response = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`POST with file ${endpoint} failed`, error);
    throw error;
  }
};

// Example usage APIs
export const UserAPI = {
  list: () => getApi('/users'),
  get: (id) => getApi(`/users/${id}`),
  create: (data) => postApi('/users', data),
  update: (id, data) => putApi(`/users/${id}`, data),
  delete: (id) => deleteApi(`/users/${id}`),
};
