import api from './axios';

export const getVendors = (params) => api.get('/customer/vendors', { params });
export const getVendorDetail = (id) => api.get(`/customer/vendors/${id}`);
export const placeOrder = (data) => api.post('/customer/orders', data);
export const getCustomerOrders = () => api.get('/customer/orders');
export const getOrderDetail = (id) => api.get(`/customer/orders/${id}`);
export const submitReview = (orderId, data) => api.post(`/customer/orders/${orderId}/review`, data);
export const updateCustomerProfile = (data) => api.patch('/customer/profile', data);
export const toggleFavourite = (vendorId) => api.post(`/customer/favourites/${vendorId}`);
export const getFavourites = () => api.get('/customer/favourites');
