"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Target,
  Award,
  TrendingUp,
  Rocket,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

// Dynamic imports with proper loading states
const Stats = dynamic(() => import("@/components/about/stats"), {
  loading: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="text-center p-6 rounded-2xl bg-white/80 shadow-sm animate-pulse"
        >
          <div className="h-8 w-20 mx-auto bg-zinc-200 rounded mb-2"></div>
          <div className="h-4 w-24 mx-auto bg-zinc-200 rounded"></div>
        </div>
      ))}
    </div>
  ),
});

const TeamValues = dynamic(() => import("@/components/about/team-values"), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white/80 shadow-sm animate-pulse"
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-200 mb-4"></div>
          <div className="h-6 w-32 bg-zinc-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-zinc-200 rounded"></div>
        </div>
      ))}
    </div>
  ),
});

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/90 pt-24 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              About Us
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            We're building the future of AI, making it accessible and powerful
            for everyone.
          </p>

          {/* Decorative line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <Stats />
        </motion.div>

        {/* Team Values Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">
              Our Core Values
            </h2>
            <p className="text-zinc-600">
              The principles that guide everything we do
            </p>
          </div>
          <TeamValues />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-3xl border border-white/50 p-12 shadow-lg shadow-blue-500/5">
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Ready to Transform Your Business?
            </h3>
            <p className="text-zinc-600 mb-6">
              Join thousands of companies using our AI platform
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Get Started Today
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
