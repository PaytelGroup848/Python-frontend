"use client";

import dynamic from "next/dynamic";
import {
  ArrowRight,
  FileText,
  Mic,
  Sparkles,
  Rocket,
  Brain,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Dynamically import Lightfall to avoid SSR issues
const Lightfall = dynamic(() => import("@/components/ui/Lightfall"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Lightfall Background */}
      <div className="fixed inset-0 -z-10">
        <Lightfall
          colors={["#A6C8FF", "#5227FF", "#FF9FFC"]}
          backgroundColor="#0A29FF"
          speed={0.4}
          streakCount={2}
          streakWidth={1}
          streakLength={1}
          glow={1}
          density={0.6}
          twinkle={1}
          zoom={3}
          backgroundGlow={0.01}
          opacity={1}
          mouseInteraction
          mouseStrength={0.5}
          mouseRadius={1}
          color1="#A6C8FF"
          color2="#5227FF"
          color3="#FF9FFC"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-16">
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                CloudeData AI
              </span>
              <br />
              <span className="text-white">Platform for Everyone</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Analyze PDFs, process voice, and harness the power of AI — all in
              one beautiful platform. Production-grade infrastructure at your
              fingertips.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
