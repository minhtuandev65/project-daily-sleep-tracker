# 💤 Daily Sleep Tracker (Web App)

Ứng dụng theo dõi giấc ngủ hàng ngày cho người dùng, giúp ghi lại thời gian ngủ, thời gian thức dậy, tổng thời gian ngủ và phân tích biểu đồ giấc ngủ theo ngày/tuần.

## 🚀 Demo

- Lên Vercel ( FE ): https://project-daily-sleep-tracker-fe.vercel.app
- Lên Render ( BE ): https://project-daily-sleep-tracker-be.onrender.com
- Link github: https://github.com/minhtuandev65/project-daily-sleep-tracker

## 🧠 Tính năng chính

- Đăng ký / đăng nhập / quên mật khẩu, xác thực qua email ( xác thực bằng email thật qua hộp thư email )
- Ghi lại thời gian đi ngủ và thức dậy
- Hiển thị biểu đồ thời gian ngủ theo ngày/tuần
- Thống kê tổng thời gian ngủ, Thời gian ngủ trung bình trong tuần.
- Số ngày người dùng ngủ dưới 6 giờ.
- Số ngày người dùng ngủ trên 8 giờ.
- Thời gian đi ngủ và thức dậy trung bình.
- Responsive, hỗ trợ mobile và desktop

---

## ⚙️ Công nghệ sử dụng

| Stack        | Chi tiết                                                                         |
| ------------ | -------------------------------------------------------------------------------- |
| 🧩 Framework | [React 20](https://reactjs.org/) + [Vite](https://vitejs.dev/)                   |
| 📦 UI        | [Ant Design](https://ant.design/), [Material UI](https://mui.com/), Tailwind CSS |
| 🔄 State     | Redux Toolkit + Redux Thunk + Redux Persist                                      |
| ⏱ Date/Time  | `dayjs`                                                                          |
| 📊 Charts    | `recharts`, `react-chartjs-2`                                                    |
| 🛠 Dev Tools  | ESLint, Vite, PostCSS, cross-env                                                 |

---

## 📦 Cài đặt & Chạy project

```bash
# 1. Clone project
git clone https://github.com/minhtuandev65/project-daily-sleep-tracker
cd project-Daily-Sleep-Tracker-FE

# 2. Cài đặt dependencies
npm install

# 3. Chạy development ( chạy local )
npm run dev

# 4. Build production ( khi deploy project )
npm run build

#5 chạy unit test cho project
npm run test