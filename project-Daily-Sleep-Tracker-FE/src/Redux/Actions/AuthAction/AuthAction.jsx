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
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Registration failed!";
      notificationFunction("error", message, "Register failed");
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
      const response = await authServices.register(registerData); // nên return từ axios
      if (response?.status === 200 || response?.status === 201) {
        notificationFunction(
          "success",
          "Registration successful, please check your email to verify your account!",
          "Success"
        );
        navigate("/login");
      } else {
        // fallback nếu server trả status lạ mà không throw lỗi
        notificationFunction(
          "error",
          "Unexpected response from server.",
          "Register failed"
        );
      }

      dispatch(hideLoadingAction);
    } catch (error) {
      dispatch(hideLoadingAction);
      const message = error?.response?.data?.message || "Registration failed!";
      notificationFunction("error", message, "Register failed");
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

export const forgotPasswordAction = (emailData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const response = await authServices.forgotPassword(emailData);

      if (response?.status === 200 || response?.status === 201) {
        notificationFunction("success", "Please check your email.", "Success");
        navigate("/login");
      } else {
        // fallback nếu server trả status lạ mà không throw lỗi
        notificationFunction(
          "error",
          "Unexpected response from server.",
          "Forgot password failed"
        );
      }
      dispatch(hideLoadingAction);
    } catch (error) {
      dispatch(hideLoadingAction);
      const message =
        error?.response?.data?.message || "Forgot password failed";
      notificationFunction("error", message, "Forgot password failed");
    }
  };
};

export const verifyAcountAction = ({ email, token }, navigate) => {
  return async (dispatch) => {
    try {
      dispatch(displayLoadingAction);
      const response = await authServices.verifyEmail({
        email,
        token,
      });
      if (response?.status === 200 || response?.status === 201) {
        notificationFunction(
          "success",
          "Authentication successful!",
          "Success"
        );
        navigate("/login");
      } else {
        // fallback nếu server trả status lạ mà không throw lỗi
        notificationFunction(
          "error",
          "Unexpected response from server.",
          "Verify account failed"
        );
      }

      dispatch(hideLoadingAction);
    } catch (error) {
      dispatch(hideLoadingAction);
      const message =
        error?.response?.data?.message || "Verify account failed!";
      notificationFunction("error", message, "Verify account failed");
    }
  };
};
