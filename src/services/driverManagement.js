// services/driverManagement.js
import { authorizedFetch } from '@/lib/apiClient';

// Get All Drivers
export async function getAlldriver(page = null, limit = null, filter = {}) {
  const query = new URLSearchParams();

  // ✅ Only include page & limit if filter is empty
  if (Object.keys(filter).length === 0) {
    if (page) query.append("page", page);
    if (limit) query.append("limit", limit);
  }

  // ✅ Pass filters as JSON string
  if (Object.keys(filter).length > 0) {
    query.append("filter", JSON.stringify(filter));
  }

  return authorizedFetch(`/admin/get-all-driver?${query.toString()}`, {
    method: "GET",
  });
}




export async function getdriverById(id) {
  return authorizedFetch(`/admin/get-driver-id?id=${id}`, {
    method: 'GET',
  });
}

export async function getAllUserTripById(id) {
  return authorizedFetch(`/admin/get-user-trips?userId=${id}`, {
    method: 'GET',
  });
}

export async function changeStatus(id , block , accountDelete) {
  let body ={} //block,
  if(accountDelete){
    body.id = id  
    body.deleted = accountDelete
  }else{
    body.id = id  
    body.block = block
  }
  return authorizedFetch(`/admin/change-user-status`, {
    method: 'POST',
     body: JSON.stringify(body),
  });
}