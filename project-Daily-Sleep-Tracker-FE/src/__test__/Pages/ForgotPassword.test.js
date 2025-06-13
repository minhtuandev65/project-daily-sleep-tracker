// src/Pages/ForgotPassword/ForgotPassword.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPassword from "../../Pages/ForgotPassword/ForgotPassword";
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

describe("ForgotPassword Page", () => {
  let store;
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({});
  });

  it("renders email input and submit button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByPlaceholderText("useremail@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send recovery email/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when email is empty", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.click(
      screen.getByRole("button", { name: /send recovery email/i })
    );
    await waitFor(() => {
      expect(screen.getByText("Please enter email!")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    );
    const input = screen.getByPlaceholderText("useremail@example.com");
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(
      screen.getByRole("button", { name: /send recovery email/i })
    );
    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });

  it("dispatches forgotPasswordAction on valid submit", async () => {
    const emailValue = "test@example.com";
    const mockForgot = jest.fn((email, navigate) => () => Promise.resolve());
    jest
      .spyOn(AuthAction, "forgotPasswordAction")
      .mockImplementation(mockForgot);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText("useremail@example.com");
    fireEvent.change(input, { target: { value: emailValue } });

    fireEvent.click(
      screen.getByRole("button", { name: /send recovery email/i })
    );

    await waitFor(() => {
      expect(mockForgot).toHaveBeenCalledWith(emailValue, mockNavigate);
    });
  });
});
