import React from "react";

import SplashScreenFooter from "./SplashScreenFooter/SplashScreenFooter";
import { Outlet } from "react-router-dom";
import SplashScreenHeader from "./SplashScreenHeader/SplashScreenHeader";
function SplashScreenTeamplate() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <SplashScreenHeader />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <SplashScreenFooter />
    </div>
  );
}

export default SplashScreenTeamplate;
