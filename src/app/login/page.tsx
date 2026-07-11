"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield, Zap, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
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
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-2 text-zinc-600">Sign in to your AI workspace</p>
          </div>

          {/* Features Badges */}
          <div className="flex justify-center gap-3 mb-8">
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

          {/* Login Form */}
          <div className="mt-6">
            <LoginForm />
          </div>

          {/* Footer Links */}
          <div className="space-y-3 mt-4 text-center">
            <p className="text-sm text-zinc-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          By continuing, you agree to our{" "}
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
