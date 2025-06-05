import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSleepTrackersByDaysAction } from "../../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";
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
import "./SleepDurationChartArea.css";
function SleepDurationChartArea({ days }) {
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
  const chartData = useMemo(() => {
    const trackers = sleepTrackersByDays?.sleepTrackers || [];
    return trackers.map((record) => {
      const dateObj = new Date(record.sleepTime);
      const dateStr = dateObj.toISOString().split("T")[0];
      return {
        date: dateStr,
        duration: record.duration || 0,
        sleepTime: new Date(record.sleepTime),
        wakeTime: new Date(record.wakeTime),
      };
    });
  }, [sleepTrackersByDays]);

  const stats = useMemo(() => {
    if (!sleepTrackersByDays) return null;
    return {
      averageDuration: sleepTrackersByDays.averageDuration || 0,
      averageSleepTime: sleepTrackersByDays.averageSleepTime || 0,
      averageWakeTime: sleepTrackersByDays.averageWakeTime || 0,
      countSleepLessThan6Hours:
        sleepTrackersByDays.countSleepLessThan6Hours || 0,
      countSleepMoreThan8Hours:
        sleepTrackersByDays.countSleepMoreThan8Hours || 0,
    };
  }, [sleepTrackersByDays]);

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
              width={500}
              height={250}
              data={chartData}
              margin={{ top: 20, right: 5, left: -30, bottom: 5 }}
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
                tickFormatter={(dateStr) => dateStr.slice(5)}
              />
              <YAxis unit="h" />
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
