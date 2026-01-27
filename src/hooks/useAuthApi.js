import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useAuthApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading, error };
}
