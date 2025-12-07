interface token {
  signed_token: {
    refreshToken: string;
    bearerToken: string;
  };
  role: string;
  permissions: [];
  id: number;
}
export function setTokens(data: token) {
  const { signed_token, role, permissions } = data;
  const { refreshToken, bearerToken } = signed_token;
  // Store data in localStorage
  localStorage.setItem("isLogged", "true");
  localStorage.setItem("userRole", role);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("permission", JSON.stringify(permissions));
  localStorage.setItem("userID", data.id.toString());
  document.cookie = "bearerToken=" + bearerToken + "; path=/";
}
