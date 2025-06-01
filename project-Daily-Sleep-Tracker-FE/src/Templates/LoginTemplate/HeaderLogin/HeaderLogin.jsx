import React from "react";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../../assets/Img/Logo/main-logo.png";
import "./HeaderLogin.css";

const { Header } = Layout;

function HeaderLogin() {
  return (
    <Layout>
      <Header className="header">
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", height: "100%" }}
        >
          <img src={logo} alt="logo" style={{ width: "200px" }} />
        </Link>
      </Header>
    </Layout>
  );
}

export default HeaderLogin;
