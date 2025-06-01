import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import logo from "../../../assets/Img/Logo/main-logo.png";
import "./SplashScreenHeader.css";
import ButtonCustom from "../../../Components/ButtonCustom/ButtonCustom";
const { Header } = Layout;
function SplashScreenHeader() {
  return (
    <Layout style={{ height: "auto", flex: "none" }}>
      <Header className="header">
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <img src={logo} alt="logo" style={{ width: "200px" }} />
        </Link>
        {/* Nút điều hướng */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to={"/login"}>
            <ButtonCustom
              htmlType="submit"
              type="text"
              text="Đăng Nhập"
              block
            />
          </Link>
        </div>
      </Header>
    </Layout>
  );
}

export default SplashScreenHeader;
