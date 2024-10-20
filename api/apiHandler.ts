import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import MMKVStorage from "@/utils/storage";

const DEFAULT_TIMEOUT = 8000;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: DEFAULT_TIMEOUT,
});

// Function to refresh the token
const refreshToken = async (): Promise<string> => {
  const currentRefreshToken = MMKVStorage.getItem("refreshToken");
  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/users/refresh-token`,
      {
        refreshToken: currentRefreshToken,
      }
    );
    const { accessToken: newAccessToken } = response?.data?.data;
    MMKVStorage.setItem("token", newAccessToken);
    MMKVStorage.removeItem("refreshToken"); // Remove the refresh token
    return newAccessToken;
  } catch (error) {
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = MMKVStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error?.response?.data?.message === "jwt expired"
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        MMKVStorage.clear();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const apiHandler = async (
  method: string,
  url: string,
  data: any = null,
  params = null,
  options: AxiosRequestConfig = {}
) => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      params,
      data,
      ...options,
    };
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorResponse = {
        message: error.response?.data?.message || "An error occurred",
        status: error.response?.status || 500,
      };
      throw errorResponse;
    }
    throw new Error("An unexpected error occurred");
  }
};

export default apiHandler;
