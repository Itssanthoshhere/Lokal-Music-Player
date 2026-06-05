import axios from 'axios';

const API_BASE_URL = 'https://saavn.sumit.co';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error(`[API Error] ${error.config?.url}: ${message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
