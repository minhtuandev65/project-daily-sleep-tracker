import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  loginAction,
  logoutAction,
  registerAction,
  getMyProfileAction,
} from "./AuthAction"; // path chính xác tới file action của bạn
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
  // ---------------- Login ----------------------------//
  it("loginAction dispatches SET_LOGIN and calls navigate on success", async () => {
    const credentials = { email: "test@example.com", password: "123456" };
    const roleResponse = { data: { role: ["ADMIN"] } };
    const loginResponse = {
      data: { accessToken: "token123", refreshToken: "refresh123" },
    };

    authServices.checkRole.mockResolvedValue(roleResponse);
    authServices.login.mockResolvedValue(loginResponse);

    await store.dispatch(loginAction(credentials, navigateMock));

    const actions = store.getActions();

    // Kiểm tra dispatch loading bắt đầu và kết thúc đúng
    expect(actions[0]).toEqual(
      expect.objectContaining({ type: "DISPLAY_LOADING" })
    );
    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "SET_LOGIN" }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );

    // Kiểm tra localStorage set đúng
    expect(localStorage.getItem("USER_LOGIN")).toContain("ADMIN");
    expect(localStorage.getItem("accessToken")).toBe("token123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh123");

    // Kiểm tra navigate được gọi đúng
    expect(navigateMock).toHaveBeenCalledWith("/admin");

    // Kiểm tra notificationFunction được gọi với message success
    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      `Hello ${credentials.email}`,
      "Successfully login"
    );
  });

  it("loginAction handles failure", async () => {
    const credentials = { email: "test@example.com", password: "123456" };
    authServices.checkRole.mockRejectedValue(new Error("fail"));

    await store.dispatch(loginAction(credentials, navigateMock));

    const actions = store.getActions();

    expect(actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "DISPLAY_LOADING" }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );

    // Kiểm tra notificationFunction gọi báo lỗi
    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Login failed",
      "Error"
    );

    // navigate không được gọi trong trường hợp lỗi
    expect(navigateMock).not.toHaveBeenCalled();
  });
  it("logoutAction calls authServices.logout and clears localStorage", async () => {
    authServices.logout.mockResolvedValue();

    await store.dispatch(logoutAction());

    const dispatchedActions = store.getActions();

    expect(dispatchedActions[0]).toEqual(
      expect.objectContaining({ type: "DISPLAY_LOADING" })
    );
    expect(dispatchedActions[dispatchedActions.length - 1]).toEqual(
      expect.objectContaining({ type: "HIDE_LOADING" })
    );
    expect(authServices.logout).toHaveBeenCalled();

    expect(localStorage.getItem("USER_LOGIN")).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
  });
  it("logoutAction handles failure", async () => {
    authServices.logout.mockRejectedValue(new Error("fail"));

    await store.dispatch(logoutAction());

    expect(notificationFunction).toHaveBeenCalledWith(
      "error",
      "Logout failed: ",
      "Error"
    );
    expect(store.getActions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "DISPLAY_LOADING" }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );
  });
  it("registerAction calls authServices.register and navigates on success", async () => {
    const registerData = { email: "test@example.com", password: "123456" };
    authServices.register.mockResolvedValue();

    await store.dispatch(registerAction(registerData, navigateMock));

    expect(authServices.register).toHaveBeenCalledWith(registerData);
    expect(navigateMock).toHaveBeenCalledWith("/login");

    const dispatchedActions = store.getActions();
    expect(dispatchedActions[0]).toEqual(
      expect.objectContaining({ type: "DISPLAY_LOADING" })
    );
    expect(dispatchedActions[dispatchedActions.length - 1]).toEqual(
      expect.objectContaining({ type: "HIDE_LOADING" })
    );
  });
  it("registerAction handles failure", async () => {
    authServices.register.mockRejectedValue(new Error("fail"));

    await store.dispatch(registerAction({}, navigateMock));

    expect(notificationFunction).toHaveBeenCalledWith(
      "success",
      "Registration successful, please check your email to verify your account!",
      "Success"
    );
    const dispatchedActions = store.getActions();
    expect(dispatchedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "DISPLAY_LOADING" }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );
  });
  it("getMyProfileAction dispatches SET_GET_MY_PROFILE on success", async () => {
    const userProfile = { name: "User1" };
    authServices.getMyProfile.mockResolvedValue({ data: userProfile });

    await store.dispatch(getMyProfileAction());

    const dispatchedActions = store.getActions();

    expect(authServices.getMyProfile).toHaveBeenCalled();
    expect(dispatchedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "DISPLAY_LOADING" }),
        expect.objectContaining({
          type: "SET_GET_MY_PROFILE",
          payload: userProfile,
        }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );
  });
  it("getMyProfileAction dispatches SET_GET_MY_PROFILE on success", async () => {
    const userProfile = { name: "User1" };
    authServices.getMyProfile.mockResolvedValue({ data: userProfile });

    await store.dispatch(getMyProfileAction());

    const dispatchedActions = store.getActions();

    expect(authServices.getMyProfile).toHaveBeenCalled();
    expect(dispatchedActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "DISPLAY_LOADING" }),
        expect.objectContaining({
          type: "SET_GET_MY_PROFILE",
          payload: userProfile,
        }),
        expect.objectContaining({ type: "HIDE_LOADING" }),
      ])
    );
  });
});
