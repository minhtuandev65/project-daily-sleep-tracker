import React from "react";
import { Outlet } from "react-router-dom";
import SplashScreenHeader from "./SplashScreenHeader/SplashScreenHeader";
import FooterTemplate from "../Footer/Footer";
function SplashScreenTeamplate() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <SplashScreenHeader />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <FooterTemplate />
    </div>
  );
}

export default SplashScreenTeamplate;
