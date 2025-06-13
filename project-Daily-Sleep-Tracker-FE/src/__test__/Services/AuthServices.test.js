// Import class cần test
import { AuthServices } from "../../Services/Auth/AuthServices";
// Import apiClient sau khi mock
import apiClient from "../../Services/BaseService/apiClient";
// Mock toàn bộ apiClient
jest.mock("../../Services/BaseService/apiClient", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("AuthServices", () => {
  let authServices;

  beforeEach(() => {
    authServices = new AuthServices();

    // Clear mock trước mỗi test
    jest.clearAllMocks();
  });

  test("login nên gọi apiClient.post với đúng url và dữ liệu", () => {
    const loginData = { username: "user", password: "pass" };

    authServices.login(loginData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/users/authenticate",
      loginData
    );
  });

  test("register nên gọi apiClient.post với đúng url và dữ liệu", () => {
    const registerData = { email: "test@example.com", password: "123456" };

    authServices.register(registerData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/users/register",
      registerData
    );
  });

  test("logout nên gọi apiClient.post với đúng url", () => {
    authServices.logout();

    expect(apiClient.post).toHaveBeenCalledWith("api/users/logout");
  });

  test("verifyEmail nên gọi apiClient.post với đúng url và dữ liệu", () => {
    const verifyData = { email: "test@example.com", code: "1234" };

    authServices.verifyEmail(verifyData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "api/users/verifyEmail",
      verifyData
    );
  });

  test("forgotPassword nên gọi apiClient.post với đúng url và email", () => {
    const email = "test@example.com";

    authServices.forgotPassword(email);

    expect(apiClient.post).toHaveBeenCalledWith("api/users/forgotPassword", {
      email,
    });
  });

  test("resetPassword nên gọi apiClient.post với đúng url, token và password", () => {
    const password = "newpassword";
    const token = "abcd1234";

    authServices.resetPassword(password, token);

    expect(apiClient.post).toHaveBeenCalledWith(
      `api/users/resetPassword?token=${token}`,
      { password }
    );
  });

  test("getMyProfile nên gọi apiClient.get với đúng url", () => {
    authServices.getMyProfile();

    expect(apiClient.get).toHaveBeenCalledWith("api/users/getMyProfile");
  });

  test("checkRole nên gọi apiClient.post với đúng url và dữ liệu", () => {
    const data = { role: "ADMIN" };

    authServices.checkRole(data);

    expect(apiClient.post).toHaveBeenCalledWith("api/users/checkRole", data);
  });
});
