import { useState } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import GlobalRoutes from "./Routes/GlobalRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <GlobalRoutes />
    </BrowserRouter>
  );
}

export default App;
