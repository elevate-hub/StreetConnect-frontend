import api from './axios';

export const getAdminStats = () => api.get('/admin/stats');
export const getAdminVendors = (status) => api.get('/admin/vendors', { params: { status } });
export const approveVendor = (id) => api.patch(`/admin/vendors/${id}/approve`);
export const rejectVendor = (id, reason) => api.patch(`/admin/vendors/${id}/reject`, { reason });
export const deactivateVendor = (id) => api.patch(`/admin/vendors/${id}/deactivate`);
export const getAdminDelivery = (status) => api.get('/admin/delivery', { params: { status } });
export const approveDelivery = (id) => api.patch(`/admin/delivery/${id}/approve`);
export const rejectDelivery = (id) => api.patch(`/admin/delivery/${id}/reject`);
export const getAdminOrders = (status) => api.get('/admin/orders', { params: { status } });
export const getAdminReviews = () => api.get('/admin/reviews');
export const deleteReview = (id) => api.delete(`/admin/reviews/${id}`);
