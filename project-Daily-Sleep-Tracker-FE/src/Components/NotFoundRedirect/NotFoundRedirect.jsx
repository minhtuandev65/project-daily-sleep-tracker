import React from "react";
import { Navigate } from "react-router-dom";

function NotFoundRedirect() {
  const isLoggedIn = !!localStorage.getItem("USER_LOGIN");
  return <Navigate to={isLoggedIn ? "/home" : "/"} replace />;
}

export default NotFoundRedirect;
