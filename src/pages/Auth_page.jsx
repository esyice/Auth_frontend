import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { registerUser, loginUser, loading, error, response } = useAuth();

  const onSubmit = async (data) => {
    if (isLogin) {
      await loginUser({
        email: data.email,
        password: data.password,
      });
    } else {
      await registerUser(data);
    }
  };

  const hasNavigated = useRef(false);

  useEffect(() => {
    // switch to login after registration
    if (response?.success && !isLogin) {
      setIsLogin(true);
      reset();
    }

    // redirect after login (ONLY ONCE)
    if (response?.token && !hasNavigated.current) {
      hasNavigated.current = true;

      localStorage.setItem("auth", response.token);

      const authRoutes = ["/login"];
      if (authRoutes.includes(location.pathname)) {
        navigate("/", { replace: true });
      }
    }
  }, [response]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium rounded-l-lg ${
              isLogin ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium rounded-r-lg ${
              !isLogin ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Register-only fields */}
          {!isLogin && (
            <>
              <div>
                <label className="text-gray-300 text-sm">Name</label>
                <input
                  {...register("name", { required: true })}
                  className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs">Name is required</p>
                )}
              </div>

              <div>
                <label className="text-gray-300 text-sm">Address</label>
                <input
                  {...register("address", { required: true })}
                  className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
                  placeholder="Enter your address"
                />
                {errors.address && (
                  <p className="text-red-400 text-xs">Address is required</p>
                )}
              </div>

              <div>
                <label className="text-gray-300 text-sm">
                  Mobile (optional)
                </label>
                <input
                  {...register("mobile")}
                  className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
                  placeholder="Enter your mobile"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">Password is required</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md font-medium ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Messages */}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        {response?.message && (
          <p className="mt-4 text-center text-green-400">{response.message}</p>
        )}

        <p className="text-center text-gray-400 mt-5 text-sm">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-400 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
