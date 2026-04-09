import api from './axios';

export const translateText = (text, source_lang = 'en') => api.post('/translate', { text, source_lang });
