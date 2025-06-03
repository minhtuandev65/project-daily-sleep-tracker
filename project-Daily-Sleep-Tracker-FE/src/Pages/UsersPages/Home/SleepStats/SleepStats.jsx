import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSleepTrackersByDaysAction } from "../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";
import ButtonCustom from "../../../../Components/ButtonCustom/ButtonCustom";
import ModelEntry from "../SleepTrackerModal/SleepTrackerModal";

function SleepStats({ days }) {
  const dispatch = useDispatch();
  const { sleepTrackersByDays } = useSelector(
    (state) => state.SleepTrackersReducer
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // Số bản ghi mỗi trang

  useEffect(() => {
    if (days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepTrackersByDaysAction(rangeStr));
      setCurrentPage(1); // Reset trang khi days thay đổi
    }
  }, [dispatch, days]);

  const handleOpenEdit = (tracker) => {
    setSelectedTracker(tracker);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTracker(null);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const mm = (d.getMonth() + 1).toString().padStart(2, "0");
    const dd = d.getDate().toString().padStart(2, "0");
    return `${mm}/${dd}`;
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  };

  if (!Array.isArray(sleepTrackersByDays) || sleepTrackersByDays.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-base">
        No data sleep tracker...
      </div>
    );
  }

  // Tính toán bản ghi cho trang hiện tại
  const totalRecords = sleepTrackersByDays.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecords = sleepTrackersByDays.slice(startIndex, endIndex);

  // Hàm chuyển trang
  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Time Sleep</th>
              <th className="border px-4 py-2 text-left">Time Wake</th>
              <th className="border px-4 py-2 text-left">Duration (h)</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {currentRecords.map((record) => (
              <tr key={record._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {formatDate(record.sleepTime)}
                </td>
                <td className="border px-4 py-2">
                  {formatTime(record.sleepTime)}
                </td>
                <td className="border px-4 py-2">
                  {formatTime(record.wakeTime)}
                </td>
                <td className="border px-4 py-2">
                  {record.duration?.toFixed(2) || "0.00"}
                </td>
                <td className="border px-4 py-2">
                  <ButtonCustom
                    text="Update"
                    onClick={() => handleOpenEdit(record)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Hiển thị số trang đơn giản */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <ModelEntry
        visible={openModal}
        onClose={handleCloseModal}
        trackerId={selectedTracker?._id}
        initialValues={selectedTracker}
      />
    </>
  );
}

export default SleepStats;
