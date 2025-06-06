# 💤 Daily Sleep Tracker (Web App)

Ứng dụng theo dõi giấc ngủ hàng ngày cho người dùng, giúp ghi lại thời gian ngủ, thời gian thức dậy, tổng thời gian ngủ và phân tích biểu đồ giấc ngủ theo ngày/tuần.

## 🚀 Demo

- Lên Vercel ( FE ): https://project-daily-sleep-tracker-fe.vercel.app
- Lên Render ( BE ): https://project-daily-sleep-tracker-be.onrender.com
- Link github: https://github.com/minhtuandev65/project-daily-sleep-tracker

## 🧠 Tính năng chính

- Đăng ký / đăng nhập / quên mật khẩu, xác thực qua email (bằng link)
  ---------------------------- User API ----------------------------------
- POST api đăng ký, xác thực email, đăng nhập, đăng xuất, phân quyền bằng role, xác thực đăng nhập, quên mật khẩu, làm mới mật khẩu.
- GET api lấy thông tin user, làm mới token.
  ---------------------------- Sleep Tracker API ------------------------
- POST api tạo mới bản ghi giấc ngủ.
- PUT api cập nhật bản ghi giấc ngủ
- GET api lấy bản ghi giấc ngủ theo userId, lấy bản ghi giấc ngủ theo ngày ( 7days or 30days ).
- Các tính năng sau được tính theo 7days or 30days
- Thống kê tổng thời gian ngủ.
- Thời gian ngủ trung bình trong tuần.
- Số ngày người dùng ngủ dưới 6 giờ.
- Số ngày người dùng ngủ trên 8 giờ.
- Thời gian đi ngủ và thức dậy trung bình.

---

## 📦 Tech Stack

- **Node.js** `>=18.x`
- **Express.js**
- **MongoDB**
- **Babel** (for ES6+)
- **Joi** for validation
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary** for media storage
- **Day.js** for date/time handling
- **Node-Cron** for scheduled tasks
- **Cors** for cookie

---

## 📦 Cài đặt & Chạy project

```bash
# 1. Clone project
git clone https://github.com/minhtuandev65/project-daily-sleep-tracker
cd project-Daily-Sleep-Tracker-BE

# 2. Cài đặt dependencies
npm install

# 3. Chạy development ( chạy local )
npm run dev

# 4. Build production ( khi deploy project )
npm run production
```
