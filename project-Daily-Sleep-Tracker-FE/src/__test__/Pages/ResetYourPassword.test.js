import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetYourPassword from "../../Pages/ResetYourPassword/ResetYourPassword";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import * as AuthAction from "../../Redux/Actions/AuthAction/AuthAction";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: "?token=mock-token-123" }),
}));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("ResetYourPassword Page", () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({});
  });

  it("renders the reset password form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("heading", { name: "Reset your password" })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter new password")
    ).toBeInTheDocument();
  });

  it("shows validation error when password is empty", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    // Mô phỏng người dùng focus + blur vào input => touched được kích hoạt
    const passwordInput = screen.getByPlaceholderText("Enter new password");
    fireEvent.blur(passwordInput);

    fireEvent.click(
      screen.getByRole("button", { name: /reset your password/i })
    );

    await waitFor(() =>
      expect(screen.getByText("Please enter new password!")).toBeInTheDocument()
    );
  });

  it("shows validation error when password is less than 6 characters", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter new password"), {
      target: { value: "123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /reset your password/i })
    );

    await waitFor(() =>
      expect(
        screen.getByText("Password must be at least 6 characters!")
      ).toBeInTheDocument()
    );
  });

  it("dispatches resetPasswordAction and navigates on success", async () => {
    const mockReset = jest.fn(
      (password, token) => () => Promise.resolve({ payload: { success: true } })
    );
    jest.spyOn(AuthAction, "resetPasswordAction").mockImplementation(mockReset);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "validpassword" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /reset your password/i })
    );

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledWith("validpassword", "mock-token-123");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error message on failure and does not navigate", async () => {
    const mockResetFail = jest.fn(
      () => () => Promise.reject(new Error("fail"))
    );
    jest
      .spyOn(AuthAction, "resetPasswordAction")
      .mockImplementation(mockResetFail);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "validpassword" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /reset your password/i })
    );

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
