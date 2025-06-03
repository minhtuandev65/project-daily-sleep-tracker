import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSleepTrackersByDaysAction,
  countDaysWithSleepLessThan6HoursAction,
  countDaysWithSleepMoreThan8HoursAction,
  getAverageSleepAndWakeTimeAction,
  getAverageSleepDurationByDays,
} from "../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";
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
import "./ChartSleepTrackers.css";
function ChartSleepTrackers({ days }) {
  const dispatch = useDispatch();
  const {
    sleepTrackersByDays,
    countDaysWithSleepLessThan6Hours,
    countDaysWithSleepMoreThan8Hours,
    averageSleepAndWakeTime,
    weeklyAverageSleep,
  } = useSelector((state) => state.SleepTrackersReducer);

  useEffect(() => {
    if (days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepTrackersByDaysAction(rangeStr));
      dispatch(countDaysWithSleepMoreThan8HoursAction(rangeStr));
      dispatch(countDaysWithSleepLessThan6HoursAction(rangeStr));
      dispatch(getAverageSleepAndWakeTimeAction(rangeStr));
      dispatch(getAverageSleepDurationByDays(rangeStr));
    }
  }, [dispatch, days]);

  const chartData = useMemo(() => {
    return (
      sleepTrackersByDays?.map((record) => {
        const dateObj = new Date(record.sleepTime);
        const dateStr = dateObj.toISOString().split("T")[0];
        return {
          date: dateStr,
          duration: record.duration || 0,
          sleepTime: new Date(record.sleepTime),
          wakeTime: new Date(record.wakeTime),
        };
      }) || []
    );
  }, [sleepTrackersByDays]);


  const stats = useMemo(() => {
    if (!chartData.length) return null;
    const totalDuration = chartData.reduce((sum, d) => sum + d.duration, 0);
    const averageDuration = (totalDuration / chartData.length).toFixed(2);
    return { averageDuration };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div className="text-center p-5 text-base text-gray-500">
        No sleep trackers...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Biểu đồ */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          width={500}
          height={250}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(dateStr) => dateStr.slice(5)} />
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

      {/* Thống kê */}
      {stats && (
        <div
          className="mt-4 p-4 bg-gray-100 rounded-xl shadow-sm text-sm space-y-2
          sm:text-sm
          max-[480px]:text-[13px]
          max-[380px]:text-[12px] max-[380px]:leading-[1.4]
        "
        >
          <p>📊 Thống kê giấc ngủ {days} ngày gần đây:</p>
          <p>
            • 💤 Thời gian ngủ trung bình:{" "}
            <strong>{weeklyAverageSleep?.data ?? 0} giờ</strong>
          </p>
          <p>
            • ⚠️ Ngủ dưới 6 giờ:{" "}
            <strong>{countDaysWithSleepLessThan6Hours?.data ?? 0} ngày</strong>
          </p>
          <p>
            • 🌙 Ngủ trên 8 giờ:{" "}
            <strong>{countDaysWithSleepMoreThan8Hours?.data ?? 0} ngày</strong>
          </p>
          <p>
            • ⏰ Giờ đi ngủ trung bình:{" "}
            <strong>{averageSleepAndWakeTime?.averageSleepTime ?? 0}</strong>
          </p>
          <p>
            • 🌅 Giờ thức dậy trung bình:{" "}
            <strong>{averageSleepAndWakeTime?.averageWakeTime ?? 0}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default ChartSleepTrackers;
