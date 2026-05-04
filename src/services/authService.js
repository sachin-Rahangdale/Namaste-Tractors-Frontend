import api from "../api/axios";

export const login = async (credentials) => {
  const response = await api.post("/user/login", credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/user/create", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};