import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // عدّل حسب رابط الـ Laravel backend
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;
