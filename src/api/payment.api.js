import api from './axios';

// Creates a Razorpay order on the backend and returns order_id + key
export const createPaymentOrder = (amount, currency = 'INR') =>
  api.post('/payment/create-order', { amount, currency });

// Verifies the payment signature on the backend after Razorpay checkout
export const verifyPayment = (paymentData) =>
  api.post('/payment/verify', paymentData);