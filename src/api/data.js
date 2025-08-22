import axiosInstance from "./axiosInstance";

// Example login API
export const userData = async (page = 1, limit = 1) => {
  const response = await axiosInstance.get(`/admin/get-all-user?page=${page}&limit=${limit}`);
  return response.data;
};

export const GetUserById = async (id) => {
  const response = await axiosInstance.get(`/admin/get-user-id?id=${id}`);
  return response.data;
};
export const changeStatus = async (data) => {
  const response = await axiosInstance.post(`/admin/change-user-status` ,data);
  return response.data;
};

export const GetUserTrips = async (id) => {
  const response = await axiosInstance.get(`/admin/get-user-trips?userId=${id}`);
  return response.data;
};

export const GetAllDriver = async (page=null , limit=null , filter ={}) => {
  console.log("limit" , limit)
const response = await axiosInstance.get(`/admin/get-all-driver`, {
    params: {
      page,
      limit,
      filter: JSON.stringify(filter), // send as string so backend can JSON.parse
    },
  });  return response.data;
};



export const changeDriverStatus = async (data) => {
  const response = await axiosInstance.post(`/admin/change-driver-status` ,data);
  return response.data;
};

export const GetDriverById = async (id) => {
  const response = await axiosInstance.get(`/admin/get-driver-id?id=${id}`);
  return response.data;
};



// ✅ Verify Bank
export const VerifyBank = async (driverId, status) => {
  const response = await axiosInstance.post(`/admin/verify-bank`, {
    driverId,
    status,
  });
  return response.data;
};

// ✅ Verify Vehicle
export const VerifyVehicle = async (driverId, status) => {
  const response = await axiosInstance.post(`/admin/verify-VehicleDetails`, {
    driverId,
    status,
  });
  return response.data;
};

// ✅ Verify License
export const VerifyLicense = async (driverId, status) => {
  const response = await axiosInstance.post(`/admin/verify-license`, {
    driverId,
    status,
  });
  return response.data;
};

// ✅ Final Admin Verification
export const VerifyByAdmin = async (driverId, status) => {
  const response = await axiosInstance.post(`/admin/verify-by-admin`, {
    driverId,
    status,
  });
  return response.data;
};






export const updateStatic = async (data) => {
  const response = await axiosInstance.post(`/admins/Update-static-content` ,data);
  return response.data;
};

export const getStatic = async (data) => {
  const response = await axiosInstance.get(`/admins/getstatic?type=${data}` );
  return response.data;
};