import React from "react";
import { Layout, Typography } from "antd";
import logo from "../../../../assets/Img/Logo/main-logo.png"; // Đường dẫn đến logo
import "./HomeFooter.css";
const { Footer } = Layout;
const { Title } = Typography;

function HomeFooter() {
  return (
    <Footer className="footerHome">
      <div className="footer-content">
        {/* Phần bên trái */}
        <div className="left-section">
          <img
            src={logo}
            alt="daily-sleep-tracker-logo"
            className="footer-logo"
          />
          <Title level={5} className="footer-title-left">
            Hệ thống quản lý và theo dõi giấc ngủ hàng đầu Việt Nam <br />
            Daily Sleep Tracker Co. Ltd. © 2016
          </Title>
        </div>

        {/* Phần bên phải */}
        <div className="right-section">
          <Title level={5} className="footer-title-right">
            Công ty TNHH Daily Sleep Tracker
          </Title>
          <Title level={5} className="footer-text-right">
            Đại diện theo pháp luật: Huỳnh Minh Tuấn
            <br />
            Địa chỉ: Tầng 5, số 112 Cao Thắng, Phường 04, Quận 3, TP.HCM
            <br />
            Hotline: 1900.xxx - Email:
          </Title>
        </div>
      </div>
    </Footer>
  );
}

export default HomeFooter;
