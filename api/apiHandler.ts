import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import MMKVStorage from "@/utils/storage";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
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

export { axiosInstance };
export default apiHandler;
