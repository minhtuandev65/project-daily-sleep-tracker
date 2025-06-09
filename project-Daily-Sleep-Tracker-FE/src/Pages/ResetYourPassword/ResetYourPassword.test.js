import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetYourPassword from "./ResetYourPassword";
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
}));
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const setupLocation = (token = "mock-token") => {
  delete window.location;
  window.location = new URL(`http://localhost/resetPassword?token=${token}`);
};
describe("ResetYourPassword Page", () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      // Ví dụ: user: { ... }
    });
    setupLocation();
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

  test("dispatches resetPasswordAction on valid submit", async () => {
    // resetPasswordAction.mockResolvedValue();
    const mockResetPasswordAction = jest.fn(() => () => Promise.resolve());
    jest
      .spyOn(AuthAction, "resetPasswordAction")
      .mockImplementation(mockResetPasswordAction);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/resetPassword?token=mock-token-123"]}>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/enter new password/i);
    fireEvent.change(input, { target: { value: "validpassword" } });

    const button = screen.getByRole("button", { name: /reset your password/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockResetPasswordAction).toHaveBeenCalledWith(
        "validpassword",
        "mock-token-123"
      );

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("handles error from resetPasswordAction", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ResetYourPassword />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText(/enter new password/i);
    fireEvent.change(input, { target: { value: "validpassword" } });

    const button = screen.getByRole("button", { name: /reset your password/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
