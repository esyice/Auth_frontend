import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // REGISTER FUNCTION
  const registerUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/auth/register`, data, {
        headers: { "Content-Type": "application/json" },
      });
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong (registerUser)",
      );
    } finally {
      setLoading(false);
    }
  };

  // LOGIN FUNCTION
  const loginUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
      });
      setResponse(res.data);
      return res.data;
    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.message || "Something went wrong (loginUser)",
      );
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loginUser, loading, error, response };
}
