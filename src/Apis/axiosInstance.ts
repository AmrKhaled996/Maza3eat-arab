import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { DEFAULT_LOCALE } from "../i18n/config";

export const axiosInstance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _skipAuthRedirect?: boolean;
}

let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If the request opted out of auth redirect (e.g. getMe on page load),
      // or we're already on the login page, just reject without redirecting.
      if (
        originalRequest._skipAuthRedirect ||
        window.location.pathname.endsWith("/login")
      ) {
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`,
              {},
              {
                withCredentials: true,
              }
            )
            .then(() => {})
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshTokenerror) {
        console.error(
          "Proccess failed, Refresh token Error",
          refreshTokenerror,
        );

        // try {
        //   const stored = localStorage.getItem("maza3eat-locale");
        //   const lang =
        //     stored === "ar" || stored === "en" ? stored : DEFAULT_LOCALE;
        //   window.location.href = `/${lang}/login`;
        // } catch {
        //   window.location.href = `/${DEFAULT_LOCALE}/login`;
        // }

        return Promise.reject(refreshTokenerror);
      }
    }

    return Promise.reject(error);
  },
);
