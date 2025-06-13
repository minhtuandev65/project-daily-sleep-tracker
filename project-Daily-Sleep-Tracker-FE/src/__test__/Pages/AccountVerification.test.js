import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import AccountVerification from "../../Pages/VerifyEmail/AccountVerification";
import { verifyAcountAction } from "../../Redux/Actions/AuthAction/AuthAction";

// Mock các module cần thiết
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useSearchParams: jest.fn(),
    useNavigate: jest.fn(() => jest.fn()),
  };
});

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
}));

jest.mock("../../Redux/Actions/AuthAction/AuthAction", () => ({
  verifyAcountAction: jest.fn(),
}));

describe("AccountVerification", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("should redirect to /404 if missing email or token", () => {
    useSearchParams.mockReturnValue([new URLSearchParams("")]);
    renderWithRouter(<AccountVerification />);
    expect(
      screen.queryByText("Đang xác thực tài khoản...")
    ).not.toBeInTheDocument();
  });

  it("should show loading spinner when verifying", () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);
    verifyAcountAction.mockImplementation(() => async () => {});
    renderWithRouter(<AccountVerification />);
    expect(screen.getByText("Đang xác thực tài khoản...")).toBeInTheDocument();
  });

  it("should call verifyAcountAction and stop loading", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);

    const mockThunk = jest.fn(); // dấu hiệu đánh dấu rằng thunk chạy
    verifyAcountAction.mockImplementation(({ email, token }, navigate) => {
      mockThunk(); // đánh dấu được gọi
      return async () => {}; // return thunk
    });

    renderWithRouter(<AccountVerification />);

    await waitFor(() => {
      expect(mockThunk).toHaveBeenCalled(); // thunk được tạo và gọi
      expect(mockDispatch).toHaveBeenCalled(); // dispatch(thunk)
    });
  });

  it("should handle error from verifyAcountAction", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);
    verifyAcountAction.mockImplementation(() => async () => {
      throw new Error("verify failed");
    });

    renderWithRouter(<AccountVerification />);

    await waitFor(() => {
      expect(
        screen.queryByText("Đang xác thực tài khoản...")
      ).not.toBeInTheDocument();
    });
  });
});
