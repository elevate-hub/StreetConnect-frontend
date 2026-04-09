import api from './axios';

export const getVendorReviewsPublic = (vendorId) => api.get(`/review/vendor/${vendorId}`);
