"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight, X, Shield, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/features/auth/services/auth.service";
import { registerUser } from "@/features/auth/services/register-service";

interface AuthModalProps {
  isOpen: boolean;
  canClose?: boolean;
  initialMode?: "login" | "signup";
  reason?: "credits_limit" | "session_expired" | "auth_required";
  onClose?: () => void;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            }
          ) => void;
          prompt?: (notification?: (notification: unknown) => void) => void;
        };
      };
    };
  }
}

let isGisInitialized = false;
let activeGoogleAuthHandler: ((credential: string) => Promise<void>) | null = null;

export function AuthModal({
  isOpen,
  canClose = false,
  initialMode = "login",
  reason = "auth_required",
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);
  const queryAuth = searchParams.get("auth");

  const [mode, setMode] = useState<"login" | "signup">(
    queryAuth === "signup" ? "signup" : initialMode
  );

  // Shared form state so entered email is preserved across tab switching
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);
  const isAuthenticatingRef = useRef(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  async function handleGoogleCredential(credential: string) {
    if (isAuthenticatingRef.current) return;
    isAuthenticatingRef.current = true;
    setGoogleLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const currentUser = useAuthStore.getState().user;
      const currentToken = useAuthStore.getState().accessToken;
      const guestToken = currentUser?.role === "guest" ? currentToken : undefined;

      const data = await authService.loginWithGoogle(credential, guestToken || undefined);
      setAuth(data.user, data.access_token, data.refresh_token);
      setSuccessMessage("Signed in with Google successfully!");
      setTimeout(() => {
        onSuccess?.();
      }, 300);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Google authentication failed");
      } else {
        setError("Google authentication failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
      isAuthenticatingRef.current = false;
    }
  }

  // Register active auth handler for currently mounted modal instance
  useEffect(() => {
    if (!isOpen) return;
    activeGoogleAuthHandler = handleGoogleCredential;
    return () => {
      if (activeGoogleAuthHandler === handleGoogleCredential) {
        activeGoogleAuthHandler = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "647663692578-u0q685v87qoqjabksdlul3t92g3mlguo.apps.googleusercontent.com";

    function mountGisButton() {
      if (!window.google?.accounts?.id) return false;

      // Singleton initialize across the entire browser tab lifetime
      if (!isGisInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential && activeGoogleAuthHandler) {
              activeGoogleAuthHandler(response.credential);
            }
          },
        });
        isGisInitialized = true;
      }

      // Render button cleanly into container ref with active theme
      if (googleButtonContainerRef.current) {
        googleButtonContainerRef.current.innerHTML = "";
        const containerWidth = googleButtonContainerRef.current.offsetWidth || 360;
        const buttonWidth = Math.min(360, Math.max(200, Math.floor(containerWidth)));
        const gisTheme = resolvedTheme === "dark" ? "filled_black" : "outline";

        window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
          theme: gisTheme,
          size: "large",
          width: buttonWidth,
          text: "continue_with",
          shape: "pill",
        });
      }
      return true;
    }

    if (mountGisButton()) return;

    // Load GIS script dynamically if not present
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (mountGisButton() || attempts >= 40) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, resolvedTheme]);

  useEffect(() => {
    if (queryAuth === "signup") {
      setMode("signup");
    } else if (queryAuth === "login") {
      setMode("login");
    }
  }, [queryAuth]);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccessMessage("");
      // Smart autofocus on appropriate initial field after animation tick
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          if (mode === "signup") {
            nameInputRef.current?.focus();
          } else {
            emailInputRef.current?.focus();
          }
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode]);

  // Handle Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && canClose && onClose) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, canClose, onClose]);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getPasswordStrength = () => {
    const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
    if (score <= 2) return { text: "Weak", color: "text-red-400", bg: "bg-red-500", percent: "25%" };
    if (score <= 3) return { text: "Fair", color: "text-amber-400", bg: "bg-amber-500", percent: "50%" };
    if (score <= 4) return { text: "Good", color: "text-blue-400", bg: "bg-blue-500", percent: "75%" };
    return { text: "Strong", color: "text-emerald-400", bg: "bg-emerald-500", percent: "100%" };
  };

  const strength = getPasswordStrength();

  // SIGN IN SUBMISSION
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const cleanEmail = email.trim().toLowerCase();
      const currentUser = useAuthStore.getState().user;
      const currentToken = useAuthStore.getState().accessToken;
      const guestToken = currentUser?.role === "guest" ? currentToken : undefined;

      const response = await authService.login({
        email: cleanEmail,
        password,
        guest_token: guestToken || undefined,
      });

      const authUser = response.user || {
        id: 1,
        email: cleanEmail,
        full_name: cleanEmail.split("@")[0].charAt(0).toUpperCase() + cleanEmail.split("@")[0].slice(1),
        role: "MEMBER",
      };

      // Atomically commit to Zustand store
      setAuth(authUser, response.access_token, response.refresh_token);

      if (onSuccess) {
        onSuccess();
      } else if (onClose) {
        onClose();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail[0]?.msg || "Invalid credentials");
        } else if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // CREATE ACCOUNT SUBMISSION
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
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
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const currentUser = useAuthStore.getState().user;
      const currentToken = useAuthStore.getState().accessToken;
      const guestToken = currentUser?.role === "guest" ? currentToken : undefined;

      // Step 1: Register with guestToken migration
      await registerUser(cleanName, cleanEmail, password, guestToken || undefined);

      // Step 2: Auto-login
      try {
        const loginRes = await authService.login({
          email: cleanEmail,
          password,
          guest_token: guestToken || undefined,
        });
        const authUser = loginRes.user || {
          id: 1,
          email: cleanEmail,
          full_name: cleanName,
          role: "MEMBER",
        };
        setAuth(authUser, loginRes.access_token, loginRes.refresh_token);
        if (onSuccess) {
          onSuccess();
        } else if (onClose) {
          onClose();
        }
      } catch (loginErr) {
        // Fallback: If auto-login fails, prompt user to sign in
        console.warn("Auto-login post-register failed:", loginErr);
        setMode("login");
        setSuccessMessage("Account created successfully! Please sign in.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Registration failed. Email may already be in use.");
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Frosted glass backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (canClose && onClose) onClose();
        }}
        className="absolute inset-0 bg-slate-200/60 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200"
      />

      {/* Modal Dialog Card */}
      <motion.div
        layout
        transition={{
          layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
          duration: 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-[440px] max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border border-slate-200/90 bg-white/95 text-slate-900 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl p-6 sm:p-8 dark:border-slate-800/90 dark:bg-slate-900/95 dark:text-slate-100 transition-colors duration-200"
      >
        {/* Day / Night Theme Toggle */}
        <div className={`absolute top-5 ${canClose ? "right-15" : "right-5"} z-10`}>
          <ThemeToggle />
        </div>

        {/* Optional Close Button */}
        {canClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          {reason === "credits_limit" ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3 shadow-xs">
                <Sparkles size={13} className="text-amber-500 fill-amber-500" />
                <span>Free Guest Limit Reached</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Your Free Credits Limit is Reached
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-sm">
                Sign in or create a free account to continue chatting, save your chat history, and unlock all AI features!
              </p>
            </>
          ) : reason === "session_expired" ? (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-500/20 mb-3 shadow-xs">
                <Sparkles size={13} className="text-slate-500" />
                <span>Session Expired</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Guest Session Expired
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-sm">
                Your temporary guest session has expired. Sign in or create an account to start a fresh chat.
              </p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25 mb-3">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                PATWATOLI AI
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === "login"
                  ? "Sign in to access your AI workspace"
                  : "Create an account to start chatting"}
              </p>
            </>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/60 p-1 mb-6 border border-slate-200/80 dark:border-slate-700/40">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === "login"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* GOOGLE SIGN-IN OFFICIAL GIS BUTTON */}
        <div className="w-full flex flex-col items-center mb-1">
          <div
            ref={googleButtonContainerRef}
            className="w-full max-w-[360px] flex justify-center items-center min-h-[40px]"
          />
          {googleLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying Google account...</span>
            </div>
          )}
        </div>

        {/* SLEEK DIVIDER */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white/95 dark:bg-slate-900/95 px-3 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
            OR
          </span>
        </div>

        {/* Notifications / Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            >
              <div className="h-4 w-4 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                !
              </div>
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORMS WITH DIRECTIONAL SLIDE & FADE TRANSITION */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "signup" ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "signup" ? -12 : 12 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            {mode === "login" ? (
              /* SIGN IN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-10 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-green-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* CREATE ACCOUNT FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      ref={nameInputRef}
                      type="text"
                      autoCapitalize="words"
                      autoCorrect="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-10 py-2.5 text-base sm:text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500 dark:border-slate-700/80 dark:bg-slate-800/70 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-800 transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {password.length > 0 && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Strength:</span>
                        <span className={`font-semibold ${strength.color}`}>{strength.text}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-800 mt-1 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength.bg}`}
                          style={{ width: strength.percent }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-green-500 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-5 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <Shield size={12} className="text-emerald-500" />
          <span>Enterprise End-to-End Encrypted Session</span>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

