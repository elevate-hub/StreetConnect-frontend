import api from './axios';

export const getMenuItems = (vendorId) => api.get(`/menu/${vendorId}`);
export const addMenuItem = (data) => api.post('/menu', data);
export const updateMenuItem = (id, data) => api.patch(`/menu/${id}`, data);
export const toggleMenuItem = (id) => api.patch(`/menu/${id}/toggle`);
export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);
