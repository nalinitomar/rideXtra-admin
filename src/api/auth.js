import axiosInstance from "./axiosInstance";

// Example login API
export const loginAdmin = async (credentials) => {
  const response = await axiosInstance.post("/admin/login", credentials);
  return response.data;
};

// Example: get profile
export const getAdminProfile = async () => {
  const response = await axiosInstance.get("/admin/profile");
  return response.data;
};


export const logout = async () => {
  const response = await axiosInstance.post("/admin/logout");
  return response.data;
};
