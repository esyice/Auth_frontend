import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top / Side navigation */}
      <Navbar />

      {/* Main content area */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
