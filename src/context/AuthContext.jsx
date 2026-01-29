import { meta } from "@eslint/js";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { data } from "react-router-dom";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const token = localStorage.getItem("auth");

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async () => {
    if (!token) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }

      const data = await res.json();

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGIN ================= */
  const login = (jwtToken) => {
    localStorage.setItem("auth", jwtToken);
    fetchDashboard(); // 🔥 fetch ONCE after login
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("auth");
    setDashboard(null);
    window.location.href = "/login";
  };

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    fetchDashboard(); // 🔥 runs once on app load
    // console.log("from context", dashboard);
  }, []);

  /* ================= Feach Api keys  ================= */
  const createApiKeys = async (payload) => {
    if (!token) {
      logout();
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/apikeys/createApiKey`,
        payload, // 👈 request body (e.g. { name })
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error("API Keys fetch failed", err.response?.data || err.message);
      throw err;
    }
  };

  const revokeAllKeys = async () => {
    if (!token) {
      logout();
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/apikeys/revokeAllKeys`,
        {}, // EMPTY BODY
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(
        "Revoke all keys failed",
        err.response?.data || err.message,
      );
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        dashboard,
        user: dashboard?.user,
        tokenInfo: dashboard?.tokens,
        usage: dashboard?.usage,
        meta: dashboard?.meta,

        login,
        logout,
        refreshDashboard: fetchDashboard, // 🔥 manual refresh hook
        createApiKeys,
        revokeAllKeys,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useAuth = () => {
  return useContext(AuthContext);
};
