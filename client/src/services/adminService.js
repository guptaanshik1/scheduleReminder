import http from "./httpService";

export const adminGetUsers = async () => {
  return await http.get(`admin/users`, { withCredentials: true });
};

export const adminGetOneUser = async (id) => {
  return await http.get(`/admin/user/${id}`, { withCredentials: true });
};

export const adminDeleteUser = async (id) => {
  return await http.delete(`admin/user/${id}`, {
    withCredentials: true,
  });
};