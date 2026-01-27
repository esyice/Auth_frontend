import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import GlobalRoutes from "./Routes/GlobalRoutes.jsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
