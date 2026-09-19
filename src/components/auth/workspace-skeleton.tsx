"use client";

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 animate-pulse select-none pointer-events-none transition-colors duration-200">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex w-72 flex-col border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-4 space-y-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-200/90 dark:bg-slate-800" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-28 rounded-md bg-slate-200/80 dark:bg-slate-800" />
            <div className="h-2.5 w-16 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
        </div>

        {/* New Chat Button */}
        <div className="h-10 w-full rounded-xl bg-slate-200/70 dark:bg-slate-800/80 mt-2" />

        {/* Navigation / Assistants */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-20 rounded bg-slate-200/60 dark:bg-slate-800/50" />
          <div className="h-9 w-full rounded-lg bg-slate-200/50 dark:bg-slate-800/40" />
          <div className="h-9 w-full rounded-lg bg-slate-200/50 dark:bg-slate-800/40" />
          <div className="h-9 w-full rounded-lg bg-slate-200/50 dark:bg-slate-800/40" />
        </div>

        {/* Recent History List */}
        <div className="flex-1 space-y-2 pt-4">
          <div className="h-3 w-16 rounded bg-slate-200/60 dark:bg-slate-800/50" />
          <div className="h-7 w-4/5 rounded bg-slate-200/40 dark:bg-slate-800/30" />
          <div className="h-7 w-3/4 rounded bg-slate-200/40 dark:bg-slate-800/30" />
          <div className="h-7 w-5/6 rounded bg-slate-200/40 dark:bg-slate-800/30" />
        </div>

        {/* User Footer */}
        <div className="h-12 w-full rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50 dark:bg-slate-950">
        {/* Header */}
        <div className="h-14 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-slate-200/80 dark:bg-slate-800" />
            <div className="h-4 w-32 rounded bg-slate-200/80 dark:bg-slate-800" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
            <div className="h-8 w-8 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80" />
          <div className="space-y-2 text-center">
            <div className="h-6 w-48 rounded-lg bg-slate-200/80 dark:bg-slate-800 mx-auto" />
            <div className="h-4 w-72 rounded bg-slate-200/60 dark:bg-slate-800/50 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl pt-4">
            <div className="h-16 rounded-xl bg-slate-200/50 dark:bg-slate-800/40" />
            <div className="h-16 rounded-xl bg-slate-200/50 dark:bg-slate-800/40" />
          </div>
        </div>

        {/* Input Composer Skeleton */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/30">
          <div className="max-w-3xl mx-auto h-14 rounded-2xl bg-slate-200/60 dark:bg-slate-800/50" />
        </div>
      </div>
    </div>
  );
}

