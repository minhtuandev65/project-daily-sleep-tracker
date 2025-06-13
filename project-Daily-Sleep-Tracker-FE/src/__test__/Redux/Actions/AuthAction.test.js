import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  loginAction,
  logoutAction,
  registerAction,
  getMyProfileAction,
  resetPasswordAction,
  forgotPasswordAction,
  verifyAcountAction,
} from "../../../Redux/Actions/AuthAction/AuthAction";
import { authServices } from "../../../Services/Auth/AuthServices";
import { notificationFunction } from "../../../Utils/libs/Notification";

jest.mock("../../../Services/Auth/AuthServices");
jest.mock("../../../Utils/libs/Notification");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("auth actions", () => {
  let store;
  const navigateMock = jest.fn();

  beforeEach(() => {
    store = mockStore({});
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("loginAction success (mobile)", async () => {
    const credentials = { email: "test@example.com", password: "123456" };
    const roleResponse = { data: { role: ["ADMIN"] } };
    const loginResponse = {
      data: {
        accessToken: "token123",
        refreshToken: "refresh123",
      },
    };

    authServices.checkRole.mockResolvedValue(roleResponse);
    authServices.login.mockResolvedValue(loginResponse);

    Object.defineProperty(global.navigator, "userAgent", {
      value: "iPhone",
      writable: true,
    });

    await store.dispatch(loginAction(credentials, navigateMock));

    const actions = store.getActions();

    expect(actions[0]).toEqual({ type: "DISPLAY_LOADING" });
    expect(actions).toEqual(
      expect.arrayContaining([
        { type: "SET_LOGIN", payload: loginResponse.data },
        { type: "HIDE_LOADING" },
      ])
    );

    expect(localStorage.getItem("accessToken")).toBe("token123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh123");

    expect(navigateMock).toHaveBeenCalledWith("/admin");
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      `Hello ${credentials.email}`,
      "Successfully login"
    );
  });

  it("loginAction fail", async () => {
    const credentials = { email: "test@example.com", password: "wrong" };
    authServices.checkRole.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    await store.dispatch(loginAction(credentials, navigateMock));

    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        { type: "DISPLAY_LOADING" },
        { type: "HIDE_LOADING" },
      ])
    );
    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Invalid credentials",
      "Login failed"
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("logoutAction success", async () => {
    localStorage.setItem("accessToken", "abc");
    localStorage.setItem("refreshToken", "def");
    localStorage.setItem("USER_LOGIN", "test");

    authServices.logout.mockResolvedValue();

    await store.dispatch(logoutAction());

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: "DISPLAY_LOADING" });
    expect(actions[1]).toEqual({ type: "HIDE_LOADING" });

    expect(authServices.logout).toHaveBeenCalled();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("USER_LOGIN")).toBeNull();
  });

  it("logoutAction fail", async () => {
    authServices.logout.mockRejectedValue({
      response: { data: { message: "Logout failed" } },
    });

    await store.dispatch(logoutAction());

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Logout failed",
      "Logout failed"
    );
  });

  it("registerAction success", async () => {
    const data = { email: "test@example.com", password: "123456" };
    authServices.register.mockResolvedValue({ status: 201 });

    await store.dispatch(registerAction(data, navigateMock));

    expect(authServices.register).toHaveBeenCalledWith(data);
    expect(navigateMock).toHaveBeenCalledWith("/login");

    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Registration successful, please check your email to verify your account!",
      "Success",
      30
    );
  });

  it("registerAction fail", async () => {
    authServices.register.mockRejectedValue({
      response: { data: { message: "Email already exists" } },
    });

    await store.dispatch(registerAction({}, navigateMock));

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Email already exists",
      "Register failed"
    );
  });

  it("getMyProfileAction success", async () => {
    const data = { name: "User1" };
    authServices.getMyProfile.mockResolvedValue({ data });

    await store.dispatch(getMyProfileAction());

    const actions = store.getActions();
    expect(actions).toEqual(
      expect.arrayContaining([
        { type: "DISPLAY_LOADING" },
        { type: "SET_GET_MY_PROFILE", payload: data },
        { type: "HIDE_LOADING" },
      ])
    );
  });

  it("getMyProfileAction fail", async () => {
    authServices.getMyProfile.mockRejectedValue({
      response: { data: { message: "Unauthorized" } },
    });

    await store.dispatch(getMyProfileAction());

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Unauthorized",
      "Get data failed!"
    );
  });

  it("resetPasswordAction success", async () => {
    authServices.resetPassword.mockResolvedValue();
    await store.dispatch(resetPasswordAction("newpass123", "token123"));

    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Password reset successful!",
      "Success"
    );
  });

  it("resetPasswordAction fail", async () => {
    authServices.resetPassword.mockRejectedValue({
      response: { data: { message: "Reset token invalid" } },
    });

    await store.dispatch(resetPasswordAction("newpass123", "token123"));

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Reset token invalid",
      "Password reset failed!"
    );
  });

  it("forgotPasswordAction success", async () => {
    authServices.forgotPassword.mockResolvedValue({ status: 200 });
    await store.dispatch(forgotPasswordAction({ email: "test@example.com" }, navigateMock));

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Please check your email.",
      "Success"
    );
  });

  it("forgotPasswordAction fail", async () => {
    authServices.forgotPassword.mockRejectedValue({
      response: { data: { message: "Email not found" } },
    });

    await store.dispatch(forgotPasswordAction({ email: "invalid@email.com" }, navigateMock));

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Email not found",
      "Forgot password failed"
    );
  });

  it("verifyAcountAction success", async () => {
    authServices.verifyEmail.mockResolvedValue({ status: 200 });
    await store.dispatch(
      verifyAcountAction({ email: "test@example.com", token: "abc" }, navigateMock)
    );

    expect(navigateMock).toHaveBeenCalledWith("/login");
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Authentication successful!",
      "Success"
    );
  });

  it("verifyAcountAction fail", async () => {
    authServices.verifyEmail.mockRejectedValue({
      response: { data: { message: "Verification failed" } },
    });

    await store.dispatch(
      verifyAcountAction({ email: "test@example.com", token: "wrong" }, navigateMock)
    );

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Verification failed",
      "Verify account failed"
    );
  });
});
