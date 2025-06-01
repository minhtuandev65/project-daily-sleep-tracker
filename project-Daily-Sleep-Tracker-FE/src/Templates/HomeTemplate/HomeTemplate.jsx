// src/Templates/HomeTemplate/HomeTemplate.jsx
import React, { useState } from "react";
import HomeHeader from "./Layout/Header/HomeHeader";
import HomeFooter from "./Layout/Footer/HomeFooter";
import { Outlet } from "react-router-dom";
import UserContext from "../../Context/UserContext";

function HomeTemplate() {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <HomeHeader />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <HomeFooter />
      </div>
    </UserContext.Provider>
  );
}

export default HomeTemplate;
