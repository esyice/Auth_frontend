import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthApi from "../hooks/useAuthApi";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerApi,
    login: loginApi,
    loading,
    error,
  } = useAuthApi();

  const { login } = useAuth(); // ✅ context login

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        const res = await loginApi({
          email: data.email,
          password: data.password,
        });

        // 🔥 single source of truth
        login(res.token);
        navigate("/", { replace: true });
      } else {
        await registerApi(data);
        setIsLogin(true);
        reset();
      }
    } catch {
      // error already handled in hook
    }
  };

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
          {!isLogin && (
            <>
              <Input
                label="Name"
                error={errors.name}
                {...register("name", { required: true })}
              />
              <Input
                label="Address"
                error={errors.address}
                {...register("address", { required: true })}
              />
              <Input label="Mobile (optional)" {...register("mobile")} />
            </>
          )}

          <Input
            label="Email"
            type="email"
            error={errors.email}
            {...register("email", { required: true })}
          />

          <Input
            label="Password"
            type="password"
            error={errors.password}
            {...register("password", { required: true })}
          />

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

        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;

/* ===== Reusable Input ===== */
const Input = React.forwardRef(({ label, error, ...props }, ref) => (
  <div>
    <label className="text-gray-300 text-sm">{label}</label>
    <input
      ref={ref}
      {...props}
      className="w-full border bg-gray-800 text-gray-200 rounded-md px-4 py-2"
    />
    {error && <p className="text-red-400 text-xs mt-1">{label} is required</p>}
  </div>
));
