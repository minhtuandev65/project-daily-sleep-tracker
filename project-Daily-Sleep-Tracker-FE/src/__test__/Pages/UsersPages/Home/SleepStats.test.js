import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SleepStats from "../../../../Pages/UsersPages/Home/SleepStats/SleepStats";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import dayjs from "dayjs";

const mockStore = configureStore([]);
const store = mockStore({});

const mockData = {
  sleepTrackers: Array.from({ length: 10 }, (_, i) => ({
    _id: `${i + 1}`,
    sleepTime: dayjs().subtract(i, "day").hour(23).minute(0).toISOString(),
    wakeTime: dayjs()
      .subtract(i - 1, "day")
      .hour(7)
      .minute(0)
      .toISOString(),
    duration: 8,
  })),
};

const renderWithProvider = (ui, { store }) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("SleepStats", () => {
  test("hiển thị bảng dữ liệu khi có sleep trackers", () => {
    renderWithProvider(<SleepStats days={7} data={mockData} />, { store });
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getAllByText("Update").length).toBeGreaterThan(0);
  });

  test("phân trang hoạt động đúng", () => {
    renderWithProvider(<SleepStats days={10} data={mockData} />, { store });
    expect(screen.getByText("2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("2"));
    expect(screen.getByText("Prev")).toBeInTheDocument();
  });

  test("mở modal khi click vào nút Update", async () => {
    renderWithProvider(<SleepStats days={7} data={mockData} />, { store });

    const updateButtons = screen.getAllByRole("button", { name: /update/i });
    fireEvent.click(updateButtons[0]);

    await waitFor(() => {
      const modalTitle = screen.getByText(/enter information sleep/i);
      expect(modalTitle).toBeInTheDocument();
    });
  });

  test("nút Prev và Next hoạt động đúng", () => {
    renderWithProvider(<SleepStats days={10} data={mockData} />, { store });
    const nextBtn = screen.getByText("Next");
    fireEvent.click(nextBtn);
    expect(screen.getByText("Prev")).toBeInTheDocument();
  });
});
