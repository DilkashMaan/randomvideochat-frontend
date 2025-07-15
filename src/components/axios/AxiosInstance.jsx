import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ no need to template string it
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ important: send cookies with every request
});

// Optional: Handle errors and attach server messages
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      error.serverErrors = error.response.data;
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
