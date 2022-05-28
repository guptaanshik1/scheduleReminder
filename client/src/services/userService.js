import http from "./httpService";

export const verifyEmail = async (email) => {
  return await http.post(`verify`, email);
};

export const register = async (user) => {
  const { name, age, email, password, confirmPassword, occupation } = user;

  return await http.post(`signup`, {
    name,
    age,
    email,
    password,
    confirmPassword,
    occupation,
  });
};

export const uploadImage = async (id, image) => {
  return await http.post(`upload/${id}`, image, { withCredentials: true });
};

export const updateImage = async (image) => {
  return await http.put(`userdashboard/updateimage`, image, {
    withCredentials: true,
  });
};

export const updatePassword = async (oldPassword, newPassowrd) => {
  return await http.post(`updatepassword`, oldPassword, newPassowrd, {
    withCredentials: true,
  });
};

export const updateUserDetails = async (data) => {
  return await http.put(`userdashboard/update`, data, {
    withCredentials: true,
  });
};