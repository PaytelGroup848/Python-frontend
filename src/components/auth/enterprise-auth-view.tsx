"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Shield,
  CheckCircle2,
  Check,
} from "lucide-react";
import axios from "axios";
import { useTheme } from "next-themes";

import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/features/auth/services/auth.service";
import { registerUser } from "@/features/auth/services/register-service";

interface EnterpriseAuthViewProps {
  initialMode?: "login" | "signup";
  redirectPath?: string;
}

let activeGoogleAuthHandler: ((credential: string) => void) | null = null;
let isGisInitialized = false;

/**
 * Continuous Fluid Gradient Animation Mesh matching Patwatoli AI's signature brand palette:
 * Deep Forest Emerald, Vibrant Mint, Rich Teal, Luminous Cyan, and Sunlit Jade Glow.
 * Enhanced with 8-11s dynamic harmonic morphing for an alive, high-energy SaaS aesthetic.
 */
function AnimatedFluidMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Base Canvas Deep Emerald-Slate Background */}
      <div className="absolute inset-0 bg-[#022c22]" />

      {/* Dynamic Background Base Flow Glow */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(16,185,129,0.35),transparent_65%)]"
      />

      {/* 1. Luminous Cyan Highlight Blob (Upper Left Sweeping) */}
      <motion.div
        animate={{
          x: [-40, 110, -50, -40],
          y: [-30, 80, -70, -30],
          scale: [1, 1.35, 0.9, 1],
          opacity: [0.65, 0.9, 0.7, 0.65],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-20 -left-20 h-[480px] w-[480px] rounded-full bg-[#06b6d4] blur-[70px]"
      />

      {/* 2. Vibrant Emerald Heart Blob (Center-Right Sweeping) */}
      <motion.div
        animate={{
          x: [40, -100, 70, 40],
          y: [-50, 90, -40, -50],
          scale: [1.1, 0.85, 1.3, 1.1],
          opacity: [0.75, 0.95, 0.8, 0.75],
          rotate: [360, 240, 120, 0],
        }}
        transition={{
          duration: 10.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -right-16 h-[500px] w-[500px] rounded-full bg-[#10b981] blur-[75px]"
      />

      {/* 3. Sunlit Lime / Emerald Aurora Splash (Vibrant contrast edge like reference image) */}
      <motion.div
        animate={{
          x: [20, -80, 90, 20],
          y: [30, -70, 50, 30],
          scale: [0.9, 1.3, 0.95, 0.9],
          opacity: [0.55, 0.85, 0.6, 0.55],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/4 h-[420px] w-[420px] rounded-full bg-[#84cc16] blur-[80px]"
      />

      {/* 4. Deep Ocean Teal Depth Blob (Bottom Left Swirl) */}
      <motion.div
        animate={{
          x: [-30, 90, -80, -30],
          y: [40, -60, 70, 40],
          scale: [1.2, 0.9, 1.25, 1.2],
          opacity: [0.7, 0.95, 0.75, 0.7],
          rotate: [180, 0, 180],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-24 left-10 h-[520px] w-[520px] rounded-full bg-[#0d9488] blur-[80px]"
      />

      {/* 5. Electric Mint Wave Blob (Bottom Right Aurora Pulse) */}
      <motion.div
        animate={{
          x: [50, -60, 40, 50],
          y: [-30, 60, -70, -30],
          scale: [1, 1.25, 0.85, 1],
          opacity: [0.65, 0.9, 0.7, 0.65],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-16 -right-16 h-[460px] w-[460px] rounded-full bg-[#34d399] blur-[75px]"
      />

      {/* Deluxe Ambient Shimmer Wave sweeping softly across the canvas */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          rotate: [0, 12, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/20 to-transparent pointer-events-none"
      />

      {/* Subtle Vignette Overlay for Depth */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
    </div>
  );
}

export function EnterpriseAuthView({
  initialMode = "login",
  redirectPath,
}: EnterpriseAuthViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  const queryAuth = searchParams.get("auth") || searchParams.get("mode");
  const targetRedirect = redirectPath || searchParams.get("redirect") || "/chat";

  const [mode, setMode] = useState<"login" | "signup">(
    queryAuth === "signup" ? "signup" : initialMode
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gisRendered, setGisRendered] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);
  const isAuthenticatingRef = useRef(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  // Sync mode with query params
  useEffect(() => {
    if (queryAuth === "signup") {
      setMode("signup");
    } else if (queryAuth === "login") {
      setMode("login");
    }
  }, [queryAuth]);

  // Google OAuth Handshake
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
      setSuccessMessage("Authenticated with Google successfully!");
      setTimeout(() => {
        router.push(targetRedirect);
      }, 350);
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

  useEffect(() => {
    activeGoogleAuthHandler = handleGoogleCredential;
    return () => {
      if (activeGoogleAuthHandler === handleGoogleCredential) {
        activeGoogleAuthHandler = null;
      }
    };
  }, []);

  // Mount Google GIS Button
  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "647663692578-u0q685v87qoqjabksdlul3t92g3mlguo.apps.googleusercontent.com";

    function mountGisButton() {
      if (!window.google?.accounts?.id) return false;

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

      if (googleButtonContainerRef.current) {
        const containerWidth = googleButtonContainerRef.current.offsetWidth || 360;
        const buttonWidth = Math.min(400, Math.max(240, Math.floor(containerWidth)));

        googleButtonContainerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
          theme: resolvedTheme === "dark" ? "filled_black" : "outline",
          size: "large",
          shape: "rectangular",
          width: buttonWidth,
          text: "continue_with",
          logo_alignment: "left",
        });
        setGisRendered(true);
      }
      return true;
    }

    if (mountGisButton()) return;

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
  }, [resolvedTheme]);

  // Autofocus input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === "signup") {
        nameInputRef.current?.focus();
      } else {
        emailInputRef.current?.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [mode]);

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { text: "", color: "", bg: "", percent: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
      return { text: "Weak", color: "text-red-500", bg: "bg-red-500", percent: "33%" };
    }
    if (score <= 4) {
      return { text: "Medium", color: "text-amber-500", bg: "bg-amber-500", percent: "66%" };
    }
    return { text: "Strong", color: "text-emerald-500", bg: "bg-emerald-500", percent: "100%" };
  };

  const strength = getPasswordStrength(password);

  // Sign In Submission
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const currentUser = useAuthStore.getState().user;
      const currentToken = useAuthStore.getState().accessToken;
      const guestToken = currentUser?.role === "guest" ? currentToken : undefined;

      const data = await authService.login({
        email: email.trim().toLowerCase(),
        password,
        guest_token: guestToken || undefined,
      });

      setAuth(data.user, data.access_token, data.refresh_token);
      setSuccessMessage("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push(targetRedirect);
      }, 350);
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
        setError("Login failed. Please verify credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Create Account Submission
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms of service & privacy policy to continue.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
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

      await registerUser(cleanName, cleanEmail, password, guestToken || undefined);

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
        setSuccessMessage("Account created successfully! Welcome aboard.");
        setTimeout(() => {
          router.push(targetRedirect);
        }, 350);
      } catch {
        setMode("login");
        setSuccessMessage("Account created successfully! Please sign in.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        setError(typeof detail === "string" ? detail : "Registration failed. Email may already be registered.");
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed");
      } else {
        setError("Unexpected error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* ======================================================== */}
      {/* LEFT SIDE: EMERALD/TEAL ANIMATED FLUID MESH (DESKTOP)     */}
      {/* ======================================================== */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col justify-between p-12 xl:p-16 overflow-hidden border-r border-slate-200/80 dark:border-slate-800/80">
        
        {/* Continuous Fluid Gradient Animation Mesh in Patwatoli Brand Colors */}
        <AnimatedFluidMesh />

        {/* Top Header: Clean Bold Typography */}
        <div className="relative z-10 space-y-2.5">
          <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-200 drop-shadow-xs">
            Patwatoli AI
          </span>
          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
            Let&apos;s Create <br /> Something.
          </h2>
          <p className="text-sm xl:text-base text-emerald-50/90 font-medium max-w-sm drop-shadow-xs pt-1">
            Next-generation enterprise AI platform built for multilingual intelligence and scale.
          </p>
        </div>

        {/* Bottom: Official Brand Identity & High Contrast Solid White Logo Tile */}
        <div className="relative z-10 pt-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-black/25 border border-white transition-all group-hover:scale-105 duration-200">
              <Image
                src="/patwatoli-icon.png"
                alt="Patwatoli AI"
                width={40}
                height={40}
                priority
                unoptimized
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <span className="text-2xl xl:text-3xl font-black tracking-tight text-white drop-shadow-md">
                Patwatoli AI
              </span>
              <span className="block text-[10px] font-bold text-emerald-200/90 tracking-widest uppercase">
                Enterprise Intelligence
              </span>
            </div>
          </Link>
          <div className="mt-5 flex items-center gap-5 text-xs text-white/80 font-medium drop-shadow-xs">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT SIDE: AUTHENTICATION FORM (DESKTOP, TABLET & PHONE) */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[52%] xl:w-[50%] flex flex-col justify-center items-center px-4 py-8 sm:px-8 sm:py-12 relative bg-white dark:bg-slate-950 overflow-y-auto">
        
        {/* Mobile & Tablet Animated Fluid Banner (< lg) */}
        <div className="lg:hidden relative w-full max-w-110 h-44 sm:h-52 overflow-hidden rounded-3xl mb-7 shrink-0 flex flex-col justify-between p-6 shadow-xl shadow-emerald-950/20">
          <AnimatedFluidMesh />
          
          <div className="relative z-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200">
              Patwatoli AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm mt-0.5">
              Let&apos;s Create Something
            </h2>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg border border-white">
              <Image
                src="/patwatoli-icon.png"
                alt="Patwatoli AI"
                width={28}
                height={28}
                priority
                unoptimized
                className="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Patwatoli AI
              </span>
            </div>
          </div>
        </div>

        {/* Main Auth Container */}
        <div className="w-full max-w-110">
          
          {/* Official Patwatoli Icon Emblem (Desktop) */}
          <div className="hidden lg:flex flex-col items-center mb-6">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-2.5 shadow-sm transition hover:shadow-md">
              <Image
                src="/patwatoli-icon.png"
                alt="Patwatoli AI Icon"
                width={48}
                height={48}
                priority
                unoptimized
                className="h-11 w-11 object-contain"
              />
            </div>
          </div>

          {/* Form Header Title */}
          <div className="text-center mb-6 sm:mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {mode === "login" ? "Log into your account" : "Create your account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {mode === "login"
                ? "Enter your credentials or continue with Google to access your workspace"
                : "Get started with your free tier and unlock all AI features"}
            </p>
          </div>

          {/* ======================================================== */}
          {/* NATIVE GOOGLE GIS BUTTON (PRODUCTION OAUTH COMPLIANT)   */}
          {/* ======================================================== */}
          <div className="w-full flex flex-col items-center mb-4">
            <div className="relative w-full max-w-90 min-h-11 flex justify-center items-center">
              {/* Official Google Button Container */}
              <div
                ref={googleButtonContainerRef}
                className="w-full flex justify-center items-center [&_iframe]:!rounded-xl [&_iframe]:shadow-2xs"
              />

              {/* Graceful Fallback Placeholder while GIS script is loading */}
              {!gisRendered && (
                <button
                  type="button"
                  disabled
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-4 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white shadow-2xs cursor-wait"
                >
                  <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>
            {googleLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Authorizing with Google...</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative my-4 sm:my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-950 px-3 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              OR
            </span>
          </div>

          {/* Alerts / Feedback Notifications */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5"
              >
                <div className="h-4 w-4 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  !
                </div>
                <span className="flex-1">{error}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5"
              >
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="flex-1">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ======================================================== */}
          {/* CREDENTIALS FORM                                         */}
          {/* ======================================================== */}
          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
            
            {/* Full Name Field (Sign Up Only) */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    autoCapitalize="words"
                    autoCorrect="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900 transition disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
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
                  placeholder="e.g., name@company.com"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900 transition disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition"
                  >
                    Forgot password?
                  </Link>
                )}
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
                  placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter (Sign Up Only) */}
              {mode === "signup" && password.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
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

            {/* Terms of Service Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition cursor-pointer ${
                  acceptedTerms
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                }`}
                aria-label="Accept terms and privacy policy"
              >
                {acceptedTerms && <Check size={12} strokeWidth={3} />}
              </button>
              <label
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
              >
                I accept the{" "}
                <Link
                  href="/terms"
                  onClick={(e) => e.stopPropagation()}
                  className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500"
                >
                  Terms of Service
                </Link>{" "}
                &amp;{" "}
                <Link
                  href="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-green-500 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{mode === "login" ? "Signing in..." : "Creating account..."}</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Continue" : "Create Account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* Mode Switch Footer */}
          <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            {mode === "login" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Enterprise Security Disclaimer */}
          <div className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <Shield size={12} className="text-emerald-500" />
            <span>Enterprise End-to-End Encrypted Session</span>
          </div>

        </div>

      </div>

    </div>
  );
}
