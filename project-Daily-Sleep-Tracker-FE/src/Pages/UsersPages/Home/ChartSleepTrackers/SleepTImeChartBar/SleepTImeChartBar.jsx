import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSleepTrackersByDaysAction } from "../../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function SleepTimeChartBar({ days }) {
  const dispatch = useDispatch();
  const { sleepTrackersByDays } = useSelector(
    (state) => state.SleepTrackersReducer
  );

  useEffect(() => {
    if (days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepTrackersByDaysAction(rangeStr));
    }
  }, [dispatch, days]);
  console.log("charts bar", sleepTrackersByDays?.sleepTrackers);
  // Lấy dữ liệu thực tế từ sleepTrackersByDays.sleepTrackers (nếu có)
  const chartData = useMemo(() => {
    return (
      sleepTrackersByDays?.sleepTrackers?.map((record) => {
        const dateObj = new Date(record.sleepTime);
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const decimalTime = parseInt(hours) + parseInt(minutes) / 60;

        return {
          label: `${month}/${day} ${hours}:${minutes}`, // <--- dùng cả ngày + giờ
          date: `${month}/${day}`,
          sleepHourDecimal: decimalTime,
        };
      }) || []
    );
  }, [sleepTrackersByDays]);

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
        width={500}
        height={250}
        data={chartData}
        margin={{ top: 40, right: 5, left: 10, bottom: -30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          angle={-45}
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
