import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useAuthApi = ()=> {
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

  // Optional: OTP functions if your backend supports it
  const sendOtp = async (payload) => {
    const res = await axios.post(`${BASE_URL}/auth/send-otp`, payload);
    return res.data;
  };

  const verifyOtp = async (payload) => {
    const res = await axios.post(`${BASE_URL}/auth/verify-otp`, payload);
    return res.data;
  };

  //Optional: Reset password function
  const resetPassword = async (payload) => {
    const res = await axios.post(`${BASE_URL}/auth/reset-password`, payload);
    return res.data;
  };

  return {
    login,
    register,
    sendOtp,
    verifyOtp,
    resetPassword,
    loading,
    error,
  };
}

export default useAuthApi;
