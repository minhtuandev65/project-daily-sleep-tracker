import React, { useEffect, useContext, useMemo } from "react";
import UserContext from "../../../../Context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import {
  getSleepRecordsByDaysAction,
  countDaysWithSleepLessThan6HoursAction,
  countDaysWithSleepMoreThan8HoursAction,
  getAverageSleepAndWakeTimeAction,
  getAverageSleepDurationByDays,
} from "../../../../Redux/Actions/UsersAction/SleepRecordsAction/SleepRecordsAction";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./ChartSleepRecords.css";
function ChartSleepRecords({ days }) {
  const { userId } = useContext(UserContext);
  const dispatch = useDispatch();
  const { sleepRecordsByDays } = useSelector(
    (state) => state.SleepRecordsReducer
  );
  const { countDaysWithSleepLessThan6Hours } = useSelector(
    (state) => state.SleepRecordsReducer
  );
  const { countDaysWithSleepMoreThan8Hours } = useSelector(
    (state) => state.SleepRecordsReducer
  );
  const { averageSleepAndWakeTime } = useSelector(
    (state) => state.SleepRecordsReducer
  );
  const { weeklyAverageSleep } = useSelector(
    (state) => state.SleepRecordsReducer
  );
  useEffect(() => {
    if (userId && days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepRecordsByDaysAction(userId, rangeStr));
      dispatch(countDaysWithSleepMoreThan8HoursAction(userId, rangeStr));
      dispatch(countDaysWithSleepLessThan6HoursAction(userId, rangeStr));
      dispatch(getAverageSleepAndWakeTimeAction(userId, rangeStr));
      dispatch(getAverageSleepDurationByDays(userId, rangeStr));
    }
  }, [dispatch, userId, days]);

  const chartData = useMemo(() => {
    return (
      sleepRecordsByDays?.map((record) => {
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
  }, [sleepRecordsByDays]);

  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const totalDuration = chartData.reduce((sum, d) => sum + d.duration, 0);
    const averageDuration = (totalDuration / chartData.length).toFixed(2);

    return {
      averageDuration,
    };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "16px",
          color: "#888",
        }}
      >
        No sleep records...
      </div>
    );
  }

  return (
    <div className="chart-sleep-wrapper">
      {/* Biểu đồ */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(dateStr) => dateStr.slice(5)} />
          <YAxis unit="h" />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value) => [`${value} hours`, "Duration"]}
          />
          <Line
            type="monotone"
            dataKey="duration"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Phân tích dữ liệu */}
      {stats && (
        <div className="mt-4 p-4 bg-gray-100 rounded-xl shadow-sm space-y-2 text-sm">
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

export default ChartSleepRecords;
