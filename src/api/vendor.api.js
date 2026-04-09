import api from './axios';

export const completeOnboarding = (data) => api.post('/vendor/onboarding', data);
export const getVendorProfile = () => api.get('/vendor/profile');
export const updateVendorProfile = (data) => api.patch('/vendor/profile', data);
export const toggleVendorOpen = () => api.patch('/vendor/toggle-open');
export const getVendorOrders = (status) => api.get('/vendor/orders', { params: { status } });
export const updateOrderStatus = (id, data) => api.patch(`/vendor/orders/${id}/status`, data);
export const getVendorReviews = () => api.get('/vendor/reviews');
export const getVendorEarnings = () => api.get('/vendor/earnings');
