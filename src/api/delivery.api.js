import api from './axios';

export const toggleAvailable = () => api.patch('/delivery/toggle-available');
export const getAvailableJobs = () => api.get('/delivery/jobs');
export const acceptJob = (orderId) => api.post(`/delivery/jobs/${orderId}/accept`);
export const updateDeliveryStatus = (id, data) => api.patch(`/delivery/orders/${id}/status`, data);
export const getDeliveryOrders = () => api.get('/delivery/orders');
export const getDeliveryEarnings = () => api.get('/delivery/earnings');
