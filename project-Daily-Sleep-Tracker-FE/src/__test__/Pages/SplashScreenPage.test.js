import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import SplashScreenPage from "../../Pages/SplashScreenPage/SplashScreenPage";

describe("SplashScreenPage", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <SplashScreenPage />
      </MemoryRouter>
    );
  });

  test("hiển thị tiêu đề chính", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /Daily Sleep Tracker/i })
    ).toBeInTheDocument();
  });

  test("hiển thị đoạn mô tả ứng dụng", () => {
    expect(
      screen.getByText(
        /helps users track, record and improve their sleep quality/i
      )
    ).toBeInTheDocument();
  });

  test("hiển thị phần tính năng chính", () => {
    expect(
      screen.getByText(/Tracker your sleep and wake up times/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Track total sleep time and sleep quality over time/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Add personal notes/i)).toBeInTheDocument();
    expect(screen.getByText(/Review sleep history/i)).toBeInTheDocument();
    expect(
      screen.getByText(/form more scientific and regular sleeping habits/i)
    ).toBeInTheDocument();
  });

  test("hiển thị nút New Entry và link đến login", () => {
    const newEntryButton = screen.getByRole("button", { name: /New Entry/i });
    expect(newEntryButton).toBeInTheDocument();

    const loginLink = screen.getByRole("link");
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
