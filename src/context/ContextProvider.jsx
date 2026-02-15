import axios, { Axios } from "axios";
import { useEffect, useState } from "react";
import AuthContext from "./Context.js";

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
      const res = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        return;
      }

      setDashboard(res.data);
      return res.data;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /// ================= GET ALL USERS IN A PROJECT =================
  const getAllProjectUsers = async (
    projectId,
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    status = null,
  ) => {
    const res = await axios.get(
      `${BASE_URL}/developer/projects/${projectId}/users`,
      {
        params: {
          page,
          limit,
          search,
          sortBy,
          sortOrder,
          status,
        },
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
        getAllProjectUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */
