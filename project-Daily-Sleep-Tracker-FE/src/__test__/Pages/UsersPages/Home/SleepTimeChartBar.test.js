import React from "react";
import { render, screen } from "@testing-library/react";
import SleepTimeChartBar from "../../../../Pages/UsersPages/Home/ChartSleepTrackers/SleepTImeChartBar/SleepTImeChartBar";
import * as formatUtils from "../../../../Utils/formatDate/formatDate";

// Mock formatDate và formatTime
jest.mock("../../../../Utils/formatDate/formatDate", () => ({
  formatDate: jest.fn(),
  formatTime: jest.fn(),
}));

describe("SleepTimeChartBar", () => {
  it("hiển thị thông báo khi không có dữ liệu", () => {
    render(<SleepTimeChartBar data={{ sleepTrackers: [] }} />);
    expect(screen.getByText("No sleep trackers...")).toBeInTheDocument();
  });

  it("hiển thị biểu đồ khi có dữ liệu", () => {
    const sleepTime1 = 1620000000000; // timestamp 1
    const sleepTime2 = sleepTime1 + 86400000; // +1 ngày

    const mockData = {
      sleepTrackers: [
        { sleepTime: sleepTime1 },
        { sleepTime: sleepTime2 },
      ],
    };

    // giả lập kết quả của formatDate/formatTime
    formatUtils.formatDate.mockImplementation((ts) => {
      if (ts === sleepTime1) return "01/05";
      if (ts === sleepTime2) return "02/05";
      return "";
    });

    formatUtils.formatTime.mockImplementation((ts) => {
      if (ts === sleepTime1) return "22:30";
      if (ts === sleepTime2) return "23:15";
      return "";
    });

    render(<SleepTimeChartBar data={mockData} />);

    // Kiểm tra label ngày có xuất hiện
    expect(screen.getAllByText("01/05").length).toBeGreaterThan(0);

    expect(screen.getAllByText("02/05").length).toBeGreaterThan(0);

    // Kiểm tra trục X và Y tồn tại
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Sleep Hour")).toBeInTheDocument();

    // Kiểm tra SVG biểu đồ được render
    expect(document.querySelector("svg")).toBeInTheDocument();
  });
});
