import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import apiHandler from "./apiHandler";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (data) => apiHandler("POST", "/users/login", data),
    onSuccess: ({ data }) => {
      setAuth(data?.accessToken, data?.refreshToken);
    },
    onError: (error) => {},
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  return useMutation({
    mutationFn: () => apiHandler("POST", "/users/logout"),
    onSuccess: () => {
      logout();
    },
  });
};

export const useFetchUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => apiHandler("GET", "/users/profile"),
  });
};
