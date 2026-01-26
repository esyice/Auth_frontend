import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth");

  // No token → no entry
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists → allow route
  // Backend will still verify on API calls
  return children;
};

export default ProtectedRoute;
