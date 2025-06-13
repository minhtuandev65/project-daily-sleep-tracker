import { formatDate, formatTime } from "../../Utils/formatDate/formatDate";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format date as MM/DD", () => {
      const input = "2023-12-01T10:15:00Z";
      const result = formatDate(input);

      // Lưu ý: do timezone khác nhau nên giá trị có thể thay đổi theo môi trường
      // Kiểm tra định dạng
      expect(result).toMatch(/^\d{2}\/\d{2}$/);
    });

    it("should return 01/01 for 1st Jan", () => {
      const input = "2023-01-01";
      expect(formatDate(input)).toBe("01/01");
    });
  });

  describe("formatTime", () => {
    it("should format time as HH:MM", () => {
      const input = "2023-06-01T09:05:00Z";
      const result = formatTime(input);

      // Lưu ý: do timezone, nên chỉ test định dạng cơ bản nếu không set timezone
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should return 00:00 for midnight local time", () => {
      const input = new Date(2023, 5, 1, 0, 0, 0).toISOString(); // 1 June 2023, 00:00 local
      expect(formatTime(input)).toBe("00:00");
    });
  });
});
