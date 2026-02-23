import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuthApi from "../hooks/useAuthApi";
import { useAuth } from "../context/Context.js";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // login | register | reset
  const [step, setStep] = useState("email"); // email | otp | complete
  const [verifiedEmail, setVerifiedEmail] = useState("");

  /* ================= OTP COOLDOWN ================= */
  const [cooldown, setCooldown] = useState(0);

  // countdown effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerApi,
    login: loginApi,
    sendRegisterOtp,
    verifyRegisterOtp,
    sendResetOtp,
    verifyResetOtp,
    resetPassword,
    loading,
    error,
  } = useAuthApi();

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      /* ===== LOGIN ===== */
      if (mode === "login") {
        const res = await loginApi({
          email: data.email,
          password: data.password,
        });

        login(res.token);
        navigate("/", { replace: true });
        return;
      }

      /* ===== REGISTER ===== */
      if (mode === "register") {
        if (step === "email") {
          await sendRegisterOtp({
            type: "email",
            identifier: data.email,
          });

          setVerifiedEmail(data.email);
          setCooldown(30);
          setStep("otp");
          return;
        }

        if (step === "otp") {
          await verifyRegisterOtp({
            type: "email",
            identifier: verifiedEmail,
            otp: data.otp,
          });

          setStep("complete");
          return;
        }

        if (step === "complete") {
          await registerApi({
            name: data.name,
            email: verifiedEmail,
            password: data.password,
          });

          setMode("login");
          setStep("email");
          reset();
          return;
        }
      }

      /* ===== RESET PASSWORD ===== */
      if (mode === "reset") {
        if (step === "email") {
          await sendResetOtp({
            type: "email",
            identifier: data.email,
          });

          setVerifiedEmail(data.email);
          setCooldown(30);
          setStep("otp");
          return;
        }

        if (step === "otp") {
          await verifyResetOtp({
            type: "email",
            identifier: verifiedEmail,
            otp: data.otp,
          });

          setStep("complete");
          return;
        }

        if (step === "complete") {
          await resetPassword({
            email: verifiedEmail,
            newPassword: data.newPassword,
          });

          alert("Password reset successful");
          setMode("login");
          setStep("email");
          reset();
          return;
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
        {/* ================= TOGGLE ================= */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              setMode("login");
              setStep("email");
            }}
            className={`px-4 py-2 font-medium rounded-l-lg ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => {
              setMode("register");
              setStep("email");
            }}
            className={`px-4 py-2 font-medium rounded-r-lg ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* ===== LOGIN ===== */}
          {mode === "login" && (
            <>
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

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setStep("email");
                  }}
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </>
          )}

          {/* ===== EMAIL STEP (REGISTER / RESET) ===== */}
          {(mode === "register" || mode === "reset") && step === "email" && (
            <Input
              label="Email"
              type="email"
              error={errors.email}
              {...register("email", { required: true })}
            />
          )}

          {/* ===== OTP STEP ===== */}
          {(mode === "register" || mode === "reset") && step === "otp" && (
            <>
              <p className="text-gray-400 text-sm">
                OTP sent to: <span className="text-white">{verifiedEmail}</span>
              </p>

              <Input
                label="Enter OTP"
                error={errors.otp}
                {...register("otp", { required: true })}
              />

              {/* 🔥 RESEND BUTTON WITH CORRECT ROUTE */}
              <div className="text-center mt-2">
                <button
                  type="button"
                  disabled={cooldown > 0}
                  onClick={async () => {
                    if (mode === "register") {
                      await sendRegisterOtp({
                        type: "email",
                        identifier: verifiedEmail,
                      });
                    } else {
                      await sendResetOtp({
                        type: "email",
                        identifier: verifiedEmail,
                      });
                    }

                    setCooldown(30);
                  }}
                  className={`text-sm ${
                    cooldown > 0
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-blue-400 hover:underline"
                  }`}
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          {/* ===== REGISTER COMPLETE ===== */}
          {mode === "register" && step === "complete" && (
            <>
              <Input
                label="Name"
                error={errors.name}
                {...register("name", { required: true })}
              />
              <Input
                label="Password"
                type="password"
                error={errors.password}
                {...register("password", { required: true })}
              />
            </>
          )}

          {/* ===== RESET COMPLETE ===== */}
          {mode === "reset" && step === "complete" && (
            <Input
              label="New Password"
              type="password"
              error={errors.newPassword}
              {...register("newPassword", { required: true })}
            />
          )}

          {/* ===== BUTTON ===== */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : step === "email"
                  ? "Send OTP"
                  : step === "otp"
                    ? "Verify OTP"
                    : mode === "register"
                      ? "Create Account"
                      : "Reset Password"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;

/* ================= INPUT ================= */

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
