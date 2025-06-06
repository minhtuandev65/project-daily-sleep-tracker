// dự án quản lý giấc ngủ
import { SET_LOGIN, SET_GET_MY_PROFILE } from "../../type/AuthType/AuthType";
import {
  displayLoadingAction,
  hideLoadingAction,
} from "../LoadingAction/LoadingAction";
import { authServices } from "../../../Services/Auth/AuthServices";
import { notificationFunction } from "../../../Utils/libs/Notification";

// Tạo action để đăng nhập
export const loginAction = (credentials, navigate) => {
  return async (dispatch) => {
    const { email } = credentials;

    const handleNavigateAndNotify = (role) => {
      const path = role.includes("ADMIN") ? "/admin" : "/home";
      navigate(path);
      notificationFunction("success", `Hello ${email}`, "Successfully login");
    };

    try {
      dispatch(displayLoadingAction);

      const {
        data: { role: roleArray },
      } = await authServices.checkRole(credentials);

      const role = Array.isArray(roleArray) ? roleArray[0] : roleArray;

      const { data: userData } = await authServices.login({
        ...credentials,
        role,
      });

      localStorage.setItem("USER_LOGIN", JSON.stringify({ email, role }));
      localStorage.setItem("accessToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);

      dispatch({
        type: SET_LOGIN,
        payload: userData,
      });

      handleNavigateAndNotify(role);

      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction("error", "Login failed", "Error");
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction("error", "Logout failed: ", "Error");
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
      notificationFunction(
        "success",
        "Registration successful, please check your email to verify your account!",
        "Success"
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
      notificationFunction("error", "Get user information failed!", "Error");
      dispatch(hideLoadingAction);
    }
  };
};

export const resetPasswordAction = (password, token) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await authServices.resetPassword(password, token);
      notificationFunction("success", "Password reset successful!", "Success");
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction("error", "Password reset failed!", "Error");
      dispatch(hideLoadingAction);
    }
  };
};

export const forgotPasswordAction = (emailData) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      await authServices.forgotPassword(emailData);
      notificationFunction("success", "Please check your email.", "Success");
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction("error", "Forgot password failed", "Error");
      dispatch(hideLoadingAction);
    }
  };
};

export const verifyAcountAction = ({ email, token }) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      console.log("action", email, token);
      await authServices.verifyEmail({
        email,
        token,
      });

      notificationFunction(
        "success",
        "Authentication successful! Redirecting...",
        "Success"
      );
      dispatch(hideLoadingAction);
    } catch (error) {
      notificationFunction("error", "Account verification failed!", "Error");
      dispatch(hideLoadingAction);
    }
  };
};
