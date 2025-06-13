// SleepDurationChartArea.test.js
import React from "react";
import { render, screen } from "@testing-library/react";

// 1) Mock ResizeObserver so that any calls to it won’t throw
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// 2) Mock ResponsiveContainer to just render its children:
jest.mock("recharts", () => {
  const ActualRecharts = jest.requireActual("recharts");
  return {
    ...ActualRecharts,
    ResponsiveContainer: ({ children }) => (
      <div data-testid="rc">{children}</div>
    ),
  };
});

// 3) Now import your component and the format utils
import SleepDurationChartArea from "../../../../Pages/UsersPages/Home/ChartSleepTrackers/SleepDurationChartArea/SleepDurationChartArea";
import * as formatUtils from "../../../../Utils/formatDate/formatDate";

// 4) Mock formatDate / formatTime
jest.mock("../../../../Utils/formatDate/formatDate", () => ({
  formatDate: jest.fn(),
  formatTime: jest.fn(),
}));

describe("SleepDurationChartArea", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty message when no trackers", () => {
    render(<SleepDurationChartArea data={{ sleepTrackers: [] }} days={7} />);
    expect(screen.getByText("No sleep trackers...")).toBeInTheDocument();
  });

  it("renders empty message when data is undefined", () => {
    render(<SleepDurationChartArea data={null} days={7} />);
    expect(screen.getByText("No sleep trackers...")).toBeInTheDocument();
  });

  it("renders chart and stats when data present", () => {
    const sleepTime = 1620000000000;
    const wakeTime = 1620036000000;
    const rawData = {
      sleepTrackers: [
        { sleepTime, wakeTime, duration: 6.5 },
        {
          sleepTime: sleepTime + 86400000,
          wakeTime: wakeTime + 86400000,
          duration: 7,
        },
      ],
      averageDuration: 6.75,
      averageSleepTime: sleepTime,
      averageWakeTime: wakeTime,
      countSleepLessThan6Hours: 1,
      countSleepMoreThan8Hours: 2,
    };

    formatUtils.formatDate.mockImplementation((ts) => `D${ts}`);
    formatUtils.formatTime.mockImplementation((ts) => `T${ts}`);

    render(<SleepDurationChartArea data={rawData} days={14} />);

    // Now because we mocked ResponsiveContainer to render children immediately,
    // our <defs id="sleepGradient"> should be in the DOM:
    expect(document.querySelector("#sleepGradient")).toBeInTheDocument();

    // Stats block
    expect(screen.getByText(/Average sleep time:/i).textContent).toContain(
      "6.75 giờ"
    );
    expect(screen.getByText(/Sleep less than 6 hours:/i).textContent).toContain(
      "1 ngày"
    );
    expect(screen.getByText(/Sleep more than 8 hours:/i).textContent).toContain(
      "2 ngày"
    );
    expect(screen.getByText(/Average sleeptime:/i).textContent).toContain(
      `T${sleepTime}`
    );
    expect(screen.getByText(/Average wake up time:/i).textContent).toContain(
      `T${wakeTime}`
    );
  });
});
