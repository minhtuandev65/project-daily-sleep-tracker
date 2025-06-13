// src/Pages/Register/RegisterPage.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage";
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

describe("RegisterPage", () => {
  let store;
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({});
  });

  it("renders all input fields and register button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/Account name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/^Confirm password$/)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/useremail@example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
  });

it("shows validation errors for empty fields", async () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>
  );

  // 1) Touch each field by firing a change (even to empty) so Formik marks it touched:
  fireEvent.change(screen.getByPlaceholderText(/Account name/i), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByPlaceholderText(/useremail@example.com/i), {
    target: { value: "" },
  });

  // 2) Submit:
  fireEvent.click(screen.getByRole("button", { name: /register/i }));

  // 3) Now the error texts (with leading "* ") will appear:
  await waitFor(() => {
    // Use a regex that allows the leading "* ":
    expect(
      screen.getByText(/Please enter account name!/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please enter password!/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please enter email!/)
    ).toBeInTheDocument();
  });
});



  it("shows error when passwords do not match", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/^Password$/), {
      target: { value: "Abc!1234" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Confirm password$/), {
      target: { value: "Different1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument();
    });
  });

  it("dispatches registerAction on valid submit", async () => {
    const validData = {
      displayName: "UserName",
      password: "Abc!1234",
      xacNhanMatKhau: "Abc!1234",
      email: "test@example.com",
    };
    const mockRegister = jest.fn((data, navigate) => () => Promise.resolve());
    jest.spyOn(AuthAction, "registerAction").mockImplementation(mockRegister);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Account name/i), {
      target: { value: validData.displayName },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/), {
      target: { value: validData.password },
    });
    fireEvent.change(screen.getByPlaceholderText(/^Confirm password$/), {
      target: { value: validData.xacNhanMatKhau },
    });

    fireEvent.change(screen.getByPlaceholderText(/useremail@example.com/i), {
      target: { value: validData.email },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        {
          displayName: validData.displayName,
          password: validData.password,
          email: validData.email,
          role: "USER",
        },
        mockNavigate
      );
    });
  });
});
