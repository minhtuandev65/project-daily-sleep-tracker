import React, { useEffect, useContext } from "react";
import UserContext from "../../../../Context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { getSleepRecordsByDaysAction } from "../../../../Redux/Actions/UsersAction/SleepRecordsAction/SleepRecordsAction";

function SleepStats({ days }) {
  const { userId } = useContext(UserContext);
  const dispatch = useDispatch();
  const { sleepRecordsByDays } = useSelector(
    (state) => state.SleepRecordsReducer
  );

  useEffect(() => {
    if (userId && days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepRecordsByDaysAction(userId, rangeStr));
    }
  }, [dispatch, userId, days]);

  // Kiểm tra dữ liệu là mảng
  if (!Array.isArray(sleepRecordsByDays) || sleepRecordsByDays.length === 0) {
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

  // Format ngày giờ
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    // Format MM/DD
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    return `${mm}/${dd}`;
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    // Format HH:mm theo 24h
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ backgroundColor: "#f0f0f0" }}>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Date</th>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Time Sleep</th>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Time Wake</th>
          <th style={{ border: "1px solid #ddd", padding: 8 }}>Duration (h)</th>
        </tr>
      </thead>
      <tbody>
        {sleepRecordsByDays.map((record) => (
          <tr key={record._id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ border: "1px solid #ddd", padding: 8 }}>
              {formatDate(record.sleepTime)}
            </td>
            <td style={{ border: "1px solid #ddd", padding: 8 }}>
              {formatTime(record.sleepTime)}
            </td>
            <td style={{ border: "1px solid #ddd", padding: 8 }}>
              {formatTime(record.wakeTime)}
            </td>
            <td style={{ border: "1px solid #ddd", padding: 8 }}>
              {record.duration?.toFixed(2) || 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SleepStats;
