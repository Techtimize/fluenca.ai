import { clearAuthTokenProvider, getAuthTokenProvider } from "@/provider/auth-provider";
import { AUTHENDPOINT } from "./auth/Auth-Endpoint";
import { toast } from "sonner";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { PAGE_ROUTES } from "@/constant/page-routes";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAuthTokenProvider();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const originalRequest = error.config;

    const isLoginRequest =
      originalRequest?.url?.includes(AUTHENDPOINT.LOGIN) &&
      originalRequest?.method === 'post';

    if (error.response && error.response.status === 401 && !isLoginRequest) {
      clearAuthTokenProvider();

      toast('Unauthorized access', {
        description: 'You are not authorized to access this resource',
      });
      window.location.href = PAGE_ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);

export default api;