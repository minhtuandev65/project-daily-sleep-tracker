import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HomePageUser from "../../../../Pages/UsersPages/Home/HomePage";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import dayjs from "dayjs";

// 👇 MOCK ACTION: Tránh lỗi async action
jest.mock(
  "../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction",
  () => ({
    getSleepTrackersByDaysAction: (days) => ({
      type: "MOCK_GET_SLEEP_TRACKERS_BY_DAYS",
      payload: days,
    }),
  })
);

// 👇 Fix lỗi window.matchMedia khi dùng Ant Design responsive
beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        media: "",
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    };
});

// 👇 Tạo store với middleware thunk
const mockStore = configureStore([thunk]);

// 👇 Dữ liệu giả để test UI
const sleepData = Array.from({ length: 7 }, (_, i) => ({
  _id: `${i + 1}`,
  sleepTime: dayjs().subtract(i, "day").hour(23).minute(0).toISOString(),
  wakeTime: dayjs()
    .subtract(i - 1, "day")
    .hour(7)
    .minute(0)
    .toISOString(),
  duration: 8,
}));

const store = mockStore({
  SleepTrackersReducer: {
    sleepTrackersByDays: sleepData,
    sleepTrackersByUserId: sleepData,
  },
});

// 👇 Hàm render wrapper
const renderWithProvider = (ui) =>
  render(<Provider store={store}>{ui}</Provider>);

// 👇 Bắt đầu test
describe("HomePageUser", () => {
  test("hiển thị tiêu đề chính", () => {
    renderWithProvider(<HomePageUser />);
    expect(
      screen.getByRole("heading", { name: /daily sleep tracker/i })
    ).toBeInTheDocument();
  });

  test("mặc định hiển thị biểu đồ duration", () => {
    renderWithProvider(<HomePageUser />);
    expect(
      screen.getByRole("heading", { name: /sleep duration/i })
    ).toBeInTheDocument();
  });

  test("chuyển sang biểu đồ sleep time", () => {
    renderWithProvider(<HomePageUser />);
    const btn = screen.getByRole("button", { name: /sleep time/i });
    fireEvent.click(btn);
    expect(
      screen.getByRole("heading", { name: /sleep time/i })
    ).toBeInTheDocument();
  });

  test("chuyển từ 7 ngày sang 30 ngày", () => {
    renderWithProvider(<HomePageUser />);
    const btn = screen.getByRole("button", { name: /last 30 days/i });
    fireEvent.click(btn);
    // Giả sử nút active có className đặc biệt, bạn có thể chỉnh sửa className nếu cần
    expect(btn.className.toLowerCase()).toContain("active");
  });

  test("mở modal khi click vào New Entry", () => {
    renderWithProvider(<HomePageUser />);
    const btn = screen.getByRole("button", { name: /new entry/i });
    fireEvent.click(btn);
    expect(screen.getByText(/enter information sleep/i)).toBeInTheDocument();
  });
});
