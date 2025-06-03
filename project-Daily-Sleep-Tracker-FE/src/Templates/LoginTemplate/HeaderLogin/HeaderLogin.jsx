import React from "react";
import { Layout, Button } from "antd";
import { Link } from "react-router-dom";
import logo from "../../../assets/Img/Logo/main-logo.png";


const { Header } = Layout;

function HeaderLogin() {
  return (
    <Layout>
      <Header className="bg-gradient-to-r from-[#f1f1f2] to-[#bcbabe] shadow-2xl flex justify-between items-center w-full relative z-50 h-[80px] 
        px-3 sm:px-5 md:px-10 lg:px-[150px]">
        {/* Logo */}
        <Link to="/" className="flex items-center h-full">
          <img src={logo} alt="logo" className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[200px] h-auto max-w-full" />
        </Link>
      </Header>
    </Layout>
  );
}

export default HeaderLogin;
