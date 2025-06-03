// src/Templates/HomeTemplate/HomeTemplate.jsx
import React from "react";
import HomeHeader from "./Layout/Header/HomeHeader";
import FooterTemplate from "../Footer/Footer";
import { Outlet } from "react-router-dom";

function HomeTemplate() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <HomeHeader />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <FooterTemplate />
    </div>
  );
}

export default HomeTemplate;
