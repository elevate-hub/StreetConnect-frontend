import api from './axios';

export const getOrderById = (id) => api.get(`/order/${id}`);
export const updateOrderStatusApi = (id, data) => api.patch(`/order/${id}/status`, data);
