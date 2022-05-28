import http from "./httpService";
import jwtDecode from "jwt-decode";

const token = "token";

export const login = async (email, password) => {
  const { data } = await http.post(`login`, {
    email,
    password,
  });
  localStorage.setItem(token, data.token);
};

export const loginWithJwt = (jwt) => {
  localStorage.setItem(token, jwt);
};

export const getJwt = () => {
  return localStorage.getItem(token);
};

export const logout = () => {
  localStorage.removeItem(token);
  return http.get(`logout`);
};

export const getUserDetails = async () => {
  const { data } = await http.get(`userdashboard`);
  const user = data.user;
  if (user) return user;
  else return null;
};

export const getCurrentUser = () => {
  try {
    const jwt = localStorage.getItem(token);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
};

export const forgotPasswordMail = async (email) => {
  const forgotToken = await http.post(`forgotpassword`, {
    email,
  });
  return forgotToken;
};

export const passwordResetFromToken = async (token, password) => {
  await http.post(`password/reset/${token}`, {
    password,
  });
};