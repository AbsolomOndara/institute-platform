import api from "./api";
export const getCurrentUser = () => api.get("/auth/me");
export const login = (credentials) => api.post("/auth/login", credentials);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");
export const changePassword = (data) => api.patch("/auth/password", data);
