"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth-store";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({
        email,
        password,
      });

      const authUser = response.user || {
        id: 1,
        email: email,
        full_name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        role: "ADMIN",
      };

      setAuth(authUser, response.access_token, response.refresh_token);

      router.push("/chat");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || "Login failed");
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
        >
          <div className="flex-shrink-0 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-xs font-bold text-red-600">!</span>
          </div>
          <span>{error}</span>
        </motion.div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <Mail className="w-4 h-4 text-zinc-400" />
          Email Address
        </label>
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
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
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Lock className="w-4 h-4 text-zinc-400" />
            Password
          </label>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-sm cursor-pointer text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
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
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          disabled={loading}
          className={`
            w-full cursor-pointer py-3.5 rounded-xl font-semibold text-base
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
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
