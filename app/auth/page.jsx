"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const isLogin = mode === "login";

  const handleTabChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setErrors({});
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!fields.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!fields.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (!isLogin) {
      if (!fields.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }
      if (!fields.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required.";
      } else if (fields.password.trim() && fields.password !== fields.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // No backend yet – this is just UI.
    }, 1200);
  };

  const togglePasswordVisibility = (key) => {
    setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-white">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-80 w-80 rounded-full bg-[#6c63ff]/30 blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/80 p-7 shadow-[0_0_70px_rgba(0,0,0,0.8)] backdrop-blur">
          {/* Top gradient accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6c63ff] via-indigo-400 to-[#6c63ff]"
          />

          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6c63ff] to-indigo-400 text-sm font-bold tracking-tight">
              XIV
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium text-white/60">
            <button
              type="button"
              onClick={() => handleTabChange("login")}
              className={`flex-1 rounded-full px-3 py-2 transition ${
                isLogin
                  ? "bg-[#6c63ff] text-white shadow-sm shadow-[#6c63ff]/40"
                  : "hover:bg-white/5"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("signup")}
              className={`flex-1 rounded-full px-3 py-2 transition ${
                !isLogin
                  ? "bg-[#6c63ff] text-white shadow-sm shadow-[#6c63ff]/40"
                  : "hover:bg-white/5"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Headings */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-xs text-white/60 sm:text-sm">
              {isLogin
                ? "Login to your XIV account"
                : "Free forever. No credit card."}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-xs font-medium text-white/70"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-white/30 ${
                    errors.fullName
                      ? "border-red-500/80 focus:border-red-400"
                      : "border-white/15 focus:border-[#6c63ff]"
                  }`}
                  placeholder="Jane Doe"
                  value={fields.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-white/70"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`w-full rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none transition placeholder:text-white/30 ${
                  errors.email
                    ? "border-red-500/80 focus:border-red-400"
                    : "border-white/15 focus:border-[#6c63ff]"
                }`}
                placeholder="you@example.com"
                value={fields.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-white/70"
                >
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-[11px] font-medium text-[#b5b0ff] hover:text-white/90"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div
                className={`relative flex items-center rounded-xl border bg-transparent px-3 text-sm transition ${
                  errors.password
                    ? "border-red-500/80 focus-within:border-red-400"
                    : "border-white/15 focus-within:border-[#6c63ff]"
                }`}
              >
                {/* Padlock icon */}
                <span className="mr-2 text-xs text-white/40" aria-hidden="true">
                  🔒
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword.password ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  className="flex-1 bg-transparent py-2.5 pr-2 text-sm outline-none placeholder:text-white/30"
                  placeholder="Enter your password"
                  value={fields.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="ml-2 text-[11px] font-medium text-white/50 hover:text-white/80"
                >
                  {showPassword.password ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password (signup only) */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-xs font-medium text-white/70"
                >
                  Confirm password
                </label>
                <div
                  className={`relative flex items-center rounded-xl border bg-transparent px-3 text-sm transition ${
                    errors.confirmPassword
                      ? "border-red-500/80 focus-within:border-red-400"
                      : "border-white/15 focus-within:border-[#6c63ff]"
                  }`}
                >
                  {/* Padlock icon */}
                  <span className="mr-2 text-xs text-white/40" aria-hidden="true">
                    🔒
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="flex-1 bg-transparent py-2.5 pr-2 text-sm outline-none placeholder:text-white/30"
                    placeholder="Re-enter your password"
                    value={fields.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="ml-2 text-[11px] font-medium text-white/50 hover:text-white/80"
                  >
                    {showPassword.confirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Primary button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#6c63ff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#6c63ff]/40 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <span
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {isLogin ? "Login" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="mt-4 flex items-center gap-3 text-[11px] text-white/40">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/80 transition hover:border-white/40 hover:bg-white/10"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-black">
                G
              </span>
              <span>
                {isLogin ? "Continue with Google" : "Sign up with Google"}
              </span>
            </button>

            {/* Bottom switch */}
            <div className="mt-4 text-center text-[11px] text-white/50">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("signup")}
                    className="font-semibold text-[#b5b0ff] hover:text-white"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className="font-semibold text-[#b5b0ff] hover:text-white"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Terms */}
          <p className="mt-6 text-center text-[10px] leading-relaxed text-white/40">
            By continuing you agree to our{" "}
            <button className="font-medium text-white/60 hover:text-white">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="font-medium text-white/60 hover:text-white">
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}