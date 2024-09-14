import apiHandler from "@/api/apiHandler";

interface AuthResponse {
  token: string;
  refreshToken: string;
}

export const refreshToken = async (
  currentRefreshToken: string
): Promise<AuthResponse> => {
  const response = await apiHandler("POST", "/refresh-token", {
    refreshToken: currentRefreshToken,
  });
  return response.data;
};
