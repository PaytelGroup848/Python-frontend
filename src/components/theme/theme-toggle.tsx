"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:border-emerald-500/50 hover:text-emerald-600 dark:border-slate-800/90 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-emerald-500/50 dark:hover:text-emerald-400 cursor-pointer"
      title={isDark ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
      aria-label={isDark ? "Switch to Day Mode (Light)" : "Switch to Night Mode (Dark)"}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 transition-transform duration-200 rotate-0 hover:rotate-12 text-amber-400" />
      ) : (
        <Moon className="h-4.5 w-4.5 transition-transform duration-200 rotate-0 hover:-rotate-12 text-slate-700" />
      )}
    </button>
  );
}