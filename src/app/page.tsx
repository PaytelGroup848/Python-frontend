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

const Threads = dynamic(() => import("@/components/ui/Threads"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Lightfall Background */}
      {/* <div className="fixed inset-0 -z-10 bg-white/90">
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
      </div> */}

      <div className="fixed inset-0 -z-10 bg-white/90">
        <Threads
          color={[0, 0.66, 0.42]}
          amplitude={1.5}
          distance={0.1}
          enableMouseInteraction={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
          {/* Hero Section */}
          <div className="text-center">
            {/* Hero Title - Dark text for light background */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                PATWATOLI AI
              </span>
              <br />
              <span className="text-zinc-800">Platform for Everyone</span>
            </h1>

<<<<<<< HEAD
            <p
              className="
                mt-3
                max-w-2xl
                text-zinc-600
                dark:text-white-400
              "
            >
              Production-grade AI infrastructure platform
              with realtime voice, OCR pipelines,
              vector search, developer APIs,
              and scalable AI orchestration.
=======
            {/* Subtitle - Dark text */}
            <p className="text-lg md:text-xl font-semibold text-zinc-700 max-w-2xl mx-auto mb-10">
              Analyze PDFs, process voice, and harness the power of AI — all in
              one beautiful platform. Production-grade infrastructure at your
              fingertips.
>>>>>>> dbc15e165008a2c5ca8a1eaaefd8e2dc21cdf827
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white border border-zinc-200 text-zinc-700 rounded-2xl font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-white/90 border-t border-zinc-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4 py-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            {/* Left Side - Copyright */}
            <div className="flex items-center gap-2 text-zinc-600">
              <span>© {new Date().getFullYear()} Patwatoli .</span>
              <span>All rights reserved.</span>
            </div>

            {/* Right Side - Terms & Privacy */}
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-zinc-600 hover:text-emerald-600 transition-colors hover:underline"
              >
                Terms
              </Link>
              <span className="text-zinc-300">|</span>
              <Link
                href="/privacy"
                className="text-zinc-600 hover:text-emerald-600 transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
