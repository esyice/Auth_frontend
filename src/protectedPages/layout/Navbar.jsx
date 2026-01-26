import { useState } from "react";
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiHome,
  FiKey,
  FiLink,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("auth");

      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local auth
      localStorage.removeItem("auth");

      // Redirect to login
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* ===== SIDEBAR OVERLAY (MOBILE) ===== */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          bg-[#020617] border-r border-slate-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white">Auth Dashboard</h1>
          <p className="text-sm text-slate-400">Secure API Management</p>
        </div>

        {/* Sidebar Nav */}
        <nav className="p-4 space-y-1">
          <SidebarItem
            to="/"
            icon={<FiHome />}
            label="Overview"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            to="/dashboard/api-keys"
            icon={<FiKey />}
            label="API Keys"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            to="/dashboard/endpoints"
            icon={<FiLink />}
            label="Endpoints"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            to="/dashboard/usage"
            icon={<FiBarChart2 />}
            label="Usage"
            onClick={() => setSidebarOpen(false)}
          />

          <SidebarItem
            to="/dashboard/settings"
            icon={<FiSettings />}
            label="Settings"
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center">
              <FiUser className="text-slate-300" />
            </div>
            <div>
              <p className="text-sm text-white font-medium">John Doe</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-20 bg-[#020617] border-b border-slate-800 ">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-300 hover:text-white text-xl "
            >
              <FiMenu />
            </button>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>

          {/* Right */}
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="
                flex items-center gap-2 px-3 py-2 rounded-lg
                text-slate-300 hover:text-white hover:bg-slate-800
              "
            >
              <FiUser />
              <span className="hidden sm:block text-sm">John Doe</span>
            </button>

            {userMenu && (
              <div
                className="
                  absolute right-0 mt-2 w-44
                  bg-[#020617] border border-slate-800
                  rounded-lg shadow-xl overflow-hidden
                "
              >
                <a
                  href="/profile"
                  className="
                    flex items-center gap-2 px-4 py-2 text-sm
                    text-slate-300 hover:bg-slate-800 hover:text-white
                  "
                >
                  <FiUser />
                  Profile
                </a>

                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-2 px-4 py-2 text-sm
                    text-red-400 hover:bg-red-950/40 hover:text-red-500
                  "
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

/* ===== Sidebar Item Component ===== */
function SidebarItem({ icon, label, to, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        w-full flex items-center gap-3 px-4 py-2 rounded-lg
        transition-colors
        ${
          isActive
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-800"
        }
      `
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
