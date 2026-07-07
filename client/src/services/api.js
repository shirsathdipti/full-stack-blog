import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Posts
export const getPosts = (params) => API.get('/posts', { params });
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const addComment = (id, data) => API.post(`/posts/${id}/comment`, data);
export const likePost = (id) => API.put(`/posts/${id}/like`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const makeAdminUser = (id) => API.put(`/admin/users/${id}/make-admin`);
export const getAdminPosts = () => API.get('/admin/posts');
export const deleteAdminPost = (id) => API.delete(`/admin/posts/${id}`);