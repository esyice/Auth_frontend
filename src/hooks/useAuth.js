import { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const sendRequest = async (type, data) => {
    setLoading(true);
    setError(null);
    try {
      const url = type === "register" ? `${BASE_URL}/register` : `${BASE_URL}/login`;
      const res = await axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, error, response };
}
