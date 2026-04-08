import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";


export const axiosInstance = axios.create({
    baseURL: '/api/v1',
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log(import.meta.env.VITE_BACKEND_URL)
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/refresh-token`, {
          withCredentials: true,
        });


        return axiosInstance(originalRequest);
      } catch (refreshTokenerror) {
        console.error("Proccess failed, Refresh token Error", refreshTokenerror);


        window.location.href = "/login";

        return Promise.reject(refreshTokenerror);
      }
    }

    return Promise.reject(error);
  }
);

