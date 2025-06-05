import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  formatDate,
  formatTime,
} from "../../../../../Utils/formatDate/formatDate";
import "../ChartsCSS/ChartsCSS.css";
function SleepTimeChartBar({ data }) {
  // Lấy dữ liệu thực tế từ sleepTrackersByDays.sleepTrackers (nếu có)
  console.log("data bar", data)
  const chartData = useMemo(() => {
    return (
      data?.sleepTrackers?.map((record) => {
        const sleepTime = record.sleepTime;
        const dateFormatted = formatDate(sleepTime); // ví dụ: "06/05"
        const timeFormatted = formatTime(sleepTime); // ví dụ: "15:08"

        const [hours, minutes] = timeFormatted.split(":").map(Number);
        const decimalTime = hours + minutes / 60;

        return {
          label: `${dateFormatted} ${timeFormatted}`, // dùng cả ngày + giờ
          date: dateFormatted,
          sleepHourDecimal: decimalTime,
        };
      }) || []
    );
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="text-center p-5 text-base text-gray-500">
        No sleep trackers...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <BarChart
        width={700}
        height={350}
        data={chartData}
        margin={{ top: 40, right: 5, left: 10, bottom: -30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-10}
          textAnchor="end"
          interval={0}
          height={70}
          label={{ value: "Date", position: "right", offset: -25 }}
        />

        <YAxis
          domain={[0, 24]}
          ticks={[0, 4, 8, 12, 16, 20, 24]}
          label={{
            value: "Sleep Hour",
            angle: 0, // Không xoay
            position: "top", // Đặt ở phía trên
            dy: -10, // Dịch lên trên thêm một chút nếu cần
          }}
          tickFormatter={(value) =>
            `${Math.floor(value).toString().padStart(2, "0")}:00`
          }
        />
        <Tooltip
          formatter={(value, name, props) => {
            const hours = Math.floor(value);
            const minutes = Math.round((value - hours) * 60);
            const formatted = `${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")}`;
            return [`${formatted}`, "Sleep Time"];
          }}
        />
        <Bar dataKey="sleepHourDecimal" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default SleepTimeChartBar;
