import apiClient from "../BaseService/apiClient";
import BaseService from "../BaseService/BaseService";

export class AuthServices extends BaseService {
  login = (loginData) => {
    return apiClient.post(`api/users/authenticate`, loginData);
  };
  register = (registerData) => {
    return apiClient.post(`api/users/register`, registerData);
  };
  logout = () => {
    return apiClient.post(`api/users/logout`);
  };
  verifyEmail = (verifyData) => {
    return apiClient.post(`api/users/verifyEmail`, verifyData);
  };
  // quên mật khẩu
  forgotPassword = (email) => {
    return apiClient.post("api/users/forgotPassword", { email });
  };
  // Đổi mật khẩu
  resetPassword = (password, token) => {
    return apiClient.post(`api/users/resetPassword?token=${token}`, {
      password,
    });
  };
  getMyProfile = () => {
    return apiClient.get(`api/users/getMyProfile`);
  };
  checkRole = (data) => {
    return apiClient.post(`api/users/checkRole`, data);
  };
}

export const authServices = new AuthServices();
