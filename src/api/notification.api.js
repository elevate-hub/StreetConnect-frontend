import api from './axios';

export const getNotifications = () => api.get('/notification');
export const markAsRead = (id) => api.patch(`/notification/${id}/read`);
export const markAllRead = () => api.patch('/notification/read-all');
