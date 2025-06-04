// dự án quản lý giấc ngủ
import { message } from "antd";
import { SET_LOGIN, SET_GET_MY_PROFILE } from "../../type/AuthType/AuthType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../LoadingAction/LoadingAction";
import { authServices } from "../../../Services/Auth/AuthServices";

// Tạo action để đăng nhập
export const loginAction = (credentials, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const {
        data: { role: roleArray },
      } = await authServices.checkRole(credentials);
      const role = Array.isArray(roleArray) ? roleArray[0] : roleArray;
      const loginData = { ...credentials, role };
      const { data: userData } = await authServices.login(loginData);
      localStorage.setItem(
        "USER_LOGIN",
        JSON.stringify({ email: credentials.email, role })
      );
      localStorage.setItem("accessToken", JSON.stringify(userData.accessToken));
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(userData.refreshToken)
      );

      dispatch({
        type: SET_LOGIN,
        payload: userData,
      });
      // Bước 4: Kiểm tra role và điều hướng đến trang phù hợp
      if (role.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Login failed: " + error.message);
      dispatch(hideLoadingAction);
    }
  };
};
// Tạo action để đăng xuất
export const logoutAction = () => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await authServices.logout();
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem("USER_LOGIN");
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Logout failed: " + error.message);
      dispatch(hideLoadingAction);
    }
  };
};
// Tạo action để đăng ký
export const registerAction = (registerData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await authServices.register(registerData);
      dispatch(hideLoadingAction);
      navigate("/login");
    } catch (error) {
      message.success(
        "Registration successful, please check your email to verify your account!"
      );
      dispatch(hideLoadingAction);
    }
  };
};

// Lấy thông tin người dùng
export const getMyProfileAction = () => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const result = await authServices.getMyProfile();

      dispatch({
        type: SET_GET_MY_PROFILE,
        payload: result.data,
      });
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Get user information failed: " + error.message);
      dispatch(hideLoadingAction);
    }
  };
};

export const resetPasswordAction = (password, token) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await authServices.resetPassword(password, token);
      message.success("Password reset successful!");
      dispatch(hideLoadingAction);
    } catch (error) {
      message.error("Password reset failed: " + error.message);
      dispatch(hideLoadingAction);
    }
  };
};
