import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import AuthContext from "./Context.js";
import { keys } from "@mantine/core";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("auth"));
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= AXIOS INSTANCE ================= */
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
    });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [token]);

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async () => {
    if (!token) return;

    try {
      const res = await api.get("/dashboard");
      setDashboard(res.data);
      console.log(res.data);

      return res.data;
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    if (!token) {
      setDashboard(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchDashboard();
    // eslint-disable-next-line
  }, [token]);

  /* ================= AUTH ================= */
  const login = (jwtToken) => {
    localStorage.setItem("auth", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setToken(null);
    setDashboard(null);
    window.location.href = "/login";
  };

  /* ================= API KEY ACTIONS ================= */
  const createApiKeys = (payload) =>
    api.post("/apikeys/createApiKey", payload).then((r) => r.data);

  const revokeAllKeys = () =>
    api.put("/apikeys/revokeAllKeys").then((r) => r.data);

  const revokeSingleKey = (keyId) =>
    api.put(`/apikeys/${keyId}/revokeSingleKey`).then((r) => r.data);

  const regenerateSingleKey = (keyId) =>
    api.put(`/apikeys/${keyId}/regenerateSingleKey`).then((r) => r.data);

  const deactivateAccount = () =>
    api.put("/auth/account/deactivate").then((r) => r.data);

  /* ================= USERS ================= */
  const getAllProjectUsers = async (
    projectId,
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    status,
  ) => {
    const res = await api.get(`/developer/projects/${projectId}/users`, {
      params: {
        page,
        limit,
        ...(search && { search }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(status && { status }),
      },
    });

    return res.data;
  };

  // Update user role or status
  const updateProjectUser = (projectId, userId, payload) =>
    api
      .put(`/developer/projects/${projectId}/users/${userId}`, payload)
      .then((r) => r.data);

  // Remove user from project
  const deleteProjectUser = (projectId, userId) =>
    api
      .delete(`/developer/projects/${projectId}/users/${userId}`)
      .then((r) => r.data);

  /* ================= CREATE SINGLE USER ================= */
  const createProjectUser = (projectId, payload) =>
    api
      .post(`/developer/projects/${projectId}/users`, payload)
      .then((r) => r.data);
  /* ================= BULK DELETE USERS ================= */
  const bulkDeleteProjectUsers = (projectId, userIds) =>
    api
      .delete(`/developer/projects/${projectId}/users/bulk`, {
        data: { ids: userIds }, // DELETE needs data inside config
      })
      .then((r) => r.data);

  // api key usage
  const getApiKeyUsage = (apiKeyId) =>
    api.get(`/dashboard/usage/${apiKeyId}`).then((r) => r.data);

  /* ================= CONTEXT VALUE ================= */
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
        refreshDashboard: fetchDashboard,

        createApiKeys,
        revokeAllKeys,
        revokeSingleKey,
        getApiKeyUsage,
        regenerateSingleKey,
        deactivateAccount,

        getAllProjectUsers,
        updateProjectUser,
        deleteProjectUser,
        createProjectUser,
        bulkDeleteProjectUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
