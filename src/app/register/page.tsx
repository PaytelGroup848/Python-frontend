"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Search,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { registerUser } from "@/features/auth/services/register-service";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "name" | "email" | "password" | null
  >(null);
  const [error, setError] = useState("");

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getPasswordStrength = () => {
    const score = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    ].filter(Boolean).length;
    if (score <= 2)
      return { text: "Weak", color: "text-red-500", bg: "bg-red-100" };
    if (score <= 3)
      return { text: "Fair", color: "text-yellow-500", bg: "bg-yellow-100" };
    if (score <= 4)
      return { text: "Good", color: "text-blue-500", bg: "bg-blue-100" };
    return { text: "Strong", color: "text-green-500", bg: "bg-green-100" };
  };

  const passwordStrength = getPasswordStrength();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerUser(name, email, password);
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Registration failed");
        console.error(error);
      } else {
        setError("Unexpected error occurred");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Floating particles */}
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-white hover:shadow-lg transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl shadow-blue-500/10 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="mt-2 text-zinc-600">Register for your AI workspace</p>
          </div>

          {/* Features Badges */}
          <div className="flex justify-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-600">
              <Shield className="w-3 h-3" />
              Secure
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-full text-xs font-medium text-purple-600">
              <Zap className="w-3 h-3" />
              Fast
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full text-xs font-medium text-indigo-600">
              <Search className="w-3 h-3" />
              Efficient
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 mb-6"
            >
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">!</span>
              </div>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <User className="w-4 h-4 text-zinc-400" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className={`
                    w-full px-4 py-3 pl-11 rounded-xl 
                    border-2 bg-white/50 backdrop-blur-sm
                    transition-all duration-200
                    ${
                      focusedField === "name"
                        ? "border-blue-400 shadow-lg shadow-blue-100/50 ring-4 ring-blue-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }
                    placeholder:text-zinc-400
                    text-zinc-900
                    outline-none
                  `}
                />
                <User
                  className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                  transition-colors duration-200
                  ${focusedField === "name" ? "text-blue-500" : "text-zinc-400"}
                `}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Mail className="w-4 h-4 text-zinc-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  className={`
                    w-full px-4 py-3 pl-11 rounded-xl 
                    border-2 bg-white/50 backdrop-blur-sm
                    transition-all duration-200
                    ${
                      focusedField === "email"
                        ? "border-blue-400 shadow-lg shadow-blue-100/50 ring-4 ring-blue-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }
                    placeholder:text-zinc-400
                    text-zinc-900
                    outline-none
                  `}
                />
                <Mail
                  className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                  transition-colors duration-200
                  ${focusedField === "email" ? "text-blue-500" : "text-zinc-400"}
                `}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Lock className="w-4 h-4 text-zinc-400" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  className={`
                    w-full px-4 py-3 pl-11 pr-12 rounded-xl 
                    border-2 bg-white/50 backdrop-blur-sm
                    transition-all duration-200
                    ${
                      focusedField === "password"
                        ? "border-blue-400 shadow-lg shadow-blue-100/50 ring-4 ring-blue-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    }
                    placeholder:text-zinc-400
                    text-zinc-900
                    outline-none
                  `}
                />
                <Lock
                  className={`
                  absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 
                  transition-colors duration-200
                  ${focusedField === "password" ? "text-blue-500" : "text-zinc-400"}
                `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          passwordStrength.color === "text-red-500"
                            ? "bg-red-500"
                            : passwordStrength.color === "text-yellow-500"
                              ? "bg-yellow-500"
                              : passwordStrength.color === "text-blue-500"
                                ? "bg-blue-500"
                                : "bg-green-500"
                        }`}
                        style={{
                          width: `${passwordStrength.text === "Weak" ? 20 : passwordStrength.text === "Fair" ? 40 : passwordStrength.text === "Good" ? 70 : 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${passwordStrength.color}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      {hasMinLength ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-zinc-300" />
                      )}
                      <span
                        className={
                          hasMinLength ? "text-green-600" : "text-zinc-400"
                        }
                      >
                        Min 8 chars
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {hasUpperCase ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-zinc-300" />
                      )}
                      <span
                        className={
                          hasUpperCase ? "text-green-600" : "text-zinc-400"
                        }
                      >
                        Uppercase
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {hasLowerCase ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-zinc-300" />
                      )}
                      <span
                        className={
                          hasLowerCase ? "text-green-600" : "text-zinc-400"
                        }
                      >
                        Lowercase
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      {hasNumber ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-zinc-300" />
                      )}
                      <span
                        className={
                          hasNumber ? "text-green-600" : "text-zinc-400"
                        }
                      >
                        Number
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3.5 rounded-xl font-semibold text-base
                  bg-gradient-to-r from-blue-600 to-purple-600
                  text-white shadow-lg shadow-blue-500/25
                  hover:shadow-blue-500/40 hover:opacity-90
                  transition-all duration-200
                  disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:text-zinc-700 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-zinc-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
