import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFoundRedirect from "../../Components/NotFoundRedirect/NotFoundRedirect";
import "@testing-library/jest-dom";

const TestWrapper = ({ initialEntries = ["/any"] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route path="*" element={<NotFoundRedirect />} />
      <Route path="/" element={<div>Redirected to Login</div>} />
      <Route path="/home" element={<div>Redirected to Home</div>} />
    </Routes>
  </MemoryRouter>
);

describe("NotFoundRedirect", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('redirects to "/" when user is not logged in', () => {
    render(<TestWrapper />);
    expect(screen.getByText("Redirected to Login")).toBeInTheDocument();
  });

  it('redirects to "/home" when user is logged in', () => {
    localStorage.setItem("USER_LOGIN", JSON.stringify({ token: "123" }));
    render(<TestWrapper />);
    expect(screen.getByText("Redirected to Home")).toBeInTheDocument();
  });
});
