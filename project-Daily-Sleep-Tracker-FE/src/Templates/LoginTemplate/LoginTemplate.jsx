import React from "react";
import HeaderLogin from "./HeaderLogin/HeaderLogin";
import { Outlet } from "react-router-dom";
import FooterTemplate from "../Footer/Footer";
function LoginTemplate() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <HeaderLogin />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <FooterTemplate />
    </div>
  );
}

export default LoginTemplate;
