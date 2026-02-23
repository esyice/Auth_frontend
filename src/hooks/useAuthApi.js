import axios from "axios";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (requestFn, fallbackMessage) => {
    setLoading(true);
    setError(null);

    try {
      const res = await requestFn();
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || fallbackMessage;

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/register`, payload),
      "Register failed",
    );

  const login = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/login`, payload),
      "Login failed",
    );

  const sendRegisterOtp = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/register/send-otp`, payload),
      "Failed to send OTP",
    );

  const verifyRegisterOtp = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/register/verify-otp`, payload),
      "OTP verification failed",
    );

  const sendResetOtp = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/reset/send-otp`, payload),
      "Failed to send OTP",
    );

  const verifyResetOtp = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/reset/verify-otp`, payload),
      "OTP verification failed",
    );

  const resetPassword = (payload) =>
    handleRequest(
      () => axios.post(`${BASE_URL}/auth/reset-password`, payload),
      "Password reset failed",
    );

  return {
    login,
    register,
    sendRegisterOtp,
    verifyRegisterOtp,
    sendResetOtp,
    verifyResetOtp,
    resetPassword,
    loading,
    error,
  };
};

export default useAuthApi;
