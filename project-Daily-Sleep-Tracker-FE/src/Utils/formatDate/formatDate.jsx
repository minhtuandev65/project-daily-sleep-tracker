// src/utils/dateUtils.jsx

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${mm}/${dd}`;
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};
