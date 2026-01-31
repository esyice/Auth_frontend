import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  /* ================= STATE ================= */
  const [token, setToken] = useState(() => localStorage.getItem("auth"));
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async () => {
    if (!token) return;

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

  /* ================= AUTO LOAD / TOKEN CHANGE ================= */
  useEffect(() => {
    if (!token) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchDashboard();
  }, [token]);

  /* ================= LOGIN ================= */
  const login = (jwtToken) => {
    localStorage.setItem("auth", jwtToken);
    setToken(jwtToken); // 🔥 triggers dashboard fetch
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("auth");
    setToken(null);
    setDashboard(null);
    window.location.href = "/login";
  };

  /* ================= CREATE API KEY ================= */
  const createApiKeys = async (payload) => {
    if (!token) return logout();

    const res = await axios.post(`${BASE_URL}/apikeys/createApiKey`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  };

  /* ================= REVOKE ALL KEYS ================= */
  const revokeAllKeys = async () => {
    if (!token) return logout();

    const res = await axios.put(
      `${BASE_URL}/apikeys/revokeAllKeys`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  /* ================= REVOKE SINGLE KEY ================= */
  const revokeSingleKey = async (keyId) => {
    if (!token) return logout();

    const res = await axios.put(
      `${BASE_URL}/apikeys/${keyId}/revokeSingleKey`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  /* ================= REGENERATE SINGLE KEY ================= */
  const regenerateSingleKey = async (keyId) => {
    if (!token) return logout();

    const res = await axios.put(
      `${BASE_URL}/apikeys/${keyId}/regenerateSingleKey`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  /* ================= DEACTIVATE ACCOUNT ================= */
  const deactivateAccount = async () => {
    if (!token) return logout();

    const res = await axios.put(
      `${BASE_URL}/auth/account/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  /* ================= CONTEXT VALUE ================= */
  return (
    <AuthContext.Provider
      value={{
        /* state */
        loading,
        dashboard,
        user: dashboard?.user,
        tokenInfo: dashboard?.tokens,
        usage: dashboard?.usage,
        meta: dashboard?.meta,

        /* actions */
        login,
        logout,
        refreshDashboard: fetchDashboard,
        createApiKeys,
        revokeAllKeys,
        revokeSingleKey,
        regenerateSingleKey,
        deactivateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useAuth = () => {
  return useContext(AuthContext);
};
