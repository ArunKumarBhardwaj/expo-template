import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import apiHandler, { axiosInstance } from "./apiHandler";
import MMKVStorage from "@/utils/storage";

const refreshToken = async (): Promise<string> => {
  const currentRefreshToken = MMKVStorage.getItem("refreshToken");
  if (!currentRefreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await apiHandler("POST", "/refresh-token", {
      refreshToken: currentRefreshToken,
    });
    const { token, refreshToken: newRefreshToken } = response;
    MMKVStorage.setItem("token", token);
    MMKVStorage.setItem("refreshToken", newRefreshToken);
    return token;
  } catch (error) {
    MMKVStorage.clear();
    throw error;
  }
};

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh error (e.g., redirect to login)
        throw refreshError;
      }
    }
    return Promise.reject(error);
  }
);

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials) =>
      apiHandler("POST", "/users/login", credentials),
    onSuccess: (data) => {
      MMKVStorage.setItem("token", data?.data.accessToken);
      MMKVStorage.setItem("refreshToken", data?.data.refreshToken);
      setAuth(data?.data.accessToken, data?.data.refreshToken);

      // Invalidate and refetch queries that depend on auth state
      queryClient.invalidateQueries();
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation<void, Error, void>({
    mutationFn: () => apiHandler("POST", "/logout"),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useUserQuery = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["user"],
    queryFn: () => apiHandler("GET", "/user"),
    enabled: isAuthenticated,
  });
};
