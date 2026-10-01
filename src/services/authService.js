import api from "./api";
export const getCurrentUser = () => api.get("/auth/me");
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");
export const changePassword = (data) => api.patch("/auth/password", data);
export const updateProfile = data => api.patch("/auth/profile", data);
export const forgotPassword = email => api.post("/auth/forgot-password", { email });
export const resetPassword = data => api.post("/auth/reset-password", data);
