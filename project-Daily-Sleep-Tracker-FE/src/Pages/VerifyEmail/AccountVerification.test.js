import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { useSearchParams, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AccountVerification from "./AccountVerification";
import { verifyAcountAction } from "../../Redux/Actions/AuthAction/AuthAction";


// Mock các module cần thiết
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
  Navigate: jest.fn(() => <div>Redirect</div>),
}));

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

  it("should redirect to /404 if missing email or token", () => {
    useSearchParams.mockReturnValue([new URLSearchParams("")]);
    render(<AccountVerification />);
    expect(screen.getByText("Redirect")).toBeInTheDocument();
  });

  it("should show loading spinner when verifying", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);
    verifyAcountAction.mockImplementation(() => async () => {});
    render(<AccountVerification />);
    expect(
      screen.getByText("Đang xác thực tài khoản...")
    ).toBeInTheDocument();
  });

  it("should redirect to /login after successful verification", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);

    mockDispatch.mockImplementation(() => Promise.resolve());
    verifyAcountAction.mockReturnValue(() => Promise.resolve());

    render(<AccountVerification />);
    await waitFor(() => {
      expect(screen.getByText("Redirect")).toBeInTheDocument();
    });
  });

  it("should fallback to 404 on verification error", async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams("email=test@example.com&token=abc123"),
    ]);

    verifyAcountAction.mockImplementation(() => async () => {
      throw new Error("verify failed");
    });

    render(<AccountVerification />);

    await waitFor(() => {
      expect(screen.getByText("Redirect")).toBeInTheDocument();
    });
  });
});
