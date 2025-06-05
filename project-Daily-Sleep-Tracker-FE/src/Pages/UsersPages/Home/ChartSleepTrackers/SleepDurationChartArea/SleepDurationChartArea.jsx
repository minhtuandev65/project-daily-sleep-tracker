import React, { useMemo } from "react";
import {
  AreaChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import "../ChartsCSS/ChartsCSS.css";
import {
  formatDate,
  formatTime,
} from "../../../../../Utils/formatDate/formatDate";
function SleepDurationChartArea({ data, days }) {
  const chartData = useMemo(() => {
    const trackers = data?.sleepTrackers || [];
    return trackers.map((record) => {
      const dateStr = formatDate(record.sleepTime); // format ngày theo utils (ví dụ "06/05")
      return {
        date: dateStr,
        duration: record.duration || 0,
        sleepTime: formatTime(record.sleepTime), // format giờ đi ngủ
        wakeTime: formatTime(record.wakeTime), // format giờ thức dậy
      };
    });
  }, [data]);

  const stats = useMemo(() => {
    if (!data) return null;
    return {
      averageDuration: data.averageDuration || 0,
      averageSleepTime: formatTime(data.averageSleepTime) || "N/A",
      averageWakeTime: formatTime(data.averageWakeTime) || "N/A",
      countSleepLessThan6Hours: data.countSleepLessThan6Hours || 0,
      countSleepMoreThan8Hours: data.countSleepMoreThan8Hours || 0,
    };
  }, [data]);

  if (!chartData.length) {
    return (
      <div className="text-center p-5 text-base text-gray-500">
        No sleep trackers...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Biểu đồ */}
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              width={460}
              height={250}
              data={chartData}
              margin={{ top: 40, right: 5, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8884d8" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>

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
                unit="h"
                label={{
                  value: "Sleep duration",
                  angle: 0, // Không xoay
                  position: "top", // Đặt ở phía trên
                  dy: -10, // Dịch lên trên thêm một chút nếu cần
                }}
              />
              <Tooltip
                labelFormatter={(label) => `Ngày: ${label}`}
                formatter={(value) => [`${value} giờ`, "Thời lượng"]}
              />

              <Area
                type="monotone"
                dataKey="duration"
                stroke="#8884d8"
                fill="url(#sleepGradient)"
                strokeWidth={2}
                dot={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Thống kê */}
      {stats && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl shadow-sm text-sm space-y-2">
          <p>📊 Thống kê giấc ngủ {days} ngày gần đây:</p>
          <p>
            • 💤 Thời gian ngủ trung bình:{" "}
            <strong>{stats.averageDuration} giờ</strong>
          </p>
          <p>
            • ⚠️ Ngủ dưới 6 giờ:{" "}
            <strong>{stats.countSleepLessThan6Hours} ngày</strong>
          </p>
          <p>
            • 🌙 Ngủ trên 8 giờ:{" "}
            <strong>{stats.countSleepMoreThan8Hours} ngày</strong>
          </p>
          <p>
            • ⏰ Giờ đi ngủ trung bình:{" "}
            <strong>{stats.averageSleepTime}</strong>
          </p>
          <p>
            • 🌅 Giờ thức dậy trung bình:{" "}
            <strong>{stats.averageWakeTime}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default SleepDurationChartArea;
