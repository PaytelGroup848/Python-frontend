"use client";

import { Sparkles, Bot, Code, FileText, Image as ImageIcon, Plus, Lock, Send, Zap, ChevronRight } from "lucide-react";

export function PublicWorkspacePreview() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 select-none pointer-events-none filter blur-[0.8px] opacity-85 transition-opacity duration-300">
      {/* MOCK SIDEBAR */}
      <div className="hidden md:flex w-72 flex-col border-r border-slate-200/90 bg-white/80 dark:border-slate-800/90 dark:bg-slate-900/80 p-4 justify-between">
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">PATWATOLI AI</h2>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Enterprise SaaS</p>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-600/10 border border-emerald-500/20 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="flex items-center gap-2">
              <Plus size={16} />
              New Conversation
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:text-emerald-300">⌘K</span>
          </div>

          {/* Assistants List */}
          <div className="space-y-1 pt-1">
            <div className="px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AI Workspaces</div>
            
            <div className="flex items-center justify-between rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-white px-3 py-2 text-xs font-medium shadow-xs">
              <span className="flex items-center gap-2.5">
                <Bot size={15} className="text-emerald-600 dark:text-emerald-400" />
                General Assistant
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
              <Code size={15} className="text-blue-500 dark:text-blue-400" />
              Code Architect
            </div>

            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
              <FileText size={15} className="text-purple-500 dark:text-purple-400" />
              Document RAG (PDF)
            </div>

            <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
              <ImageIcon size={15} className="text-pink-500 dark:text-pink-400" />
              Media Studio (Remove BG)
            </div>
          </div>

          {/* Sample History */}
          <div className="space-y-1 pt-3">
            <div className="px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recent Sessions</div>
            <div className="rounded-lg px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">System Architecture Design</div>
            <div className="rounded-lg px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">Python WebSocket Engine</div>
            <div className="rounded-lg px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 truncate">Document Analysis Summary</div>
          </div>
        </div>

        {/* Footer Guest Indicator */}
        <div className="rounded-xl border border-slate-200 bg-white/90 text-slate-900 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <Lock size={14} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">Guest Session</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Sign in to unlock</div>
            </div>
          </div>
        </div>
      </div>

      {/* MOCK MAIN CHAT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-slate-200/80 bg-white/60 dark:border-slate-800/90 dark:bg-slate-900/60 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Bot size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">General Assistant</span>
            <span className="rounded-full bg-emerald-50 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-slate-700/60">
              Active Engine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
              <Zap size={13} className="text-amber-500 dark:text-amber-400" />
              High Speed LPU
            </div>
          </div>
        </div>

        {/* Chat Center */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-2xl mx-auto w-full text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-xl shadow-emerald-500/20">
            <Sparkles size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Experience the Future of AI
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Real-time token streaming, specialized code architect, document intelligence, and instant media transformation.
            </p>
          </div>

          {/* Sample Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-2">
            <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 p-3.5 text-left transition">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Code Architecture</span>
                <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Design a high-concurrency microservice in Go or Python</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60 p-3.5 text-left transition">
              <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Document Analysis</span>
                <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Upload complex PDFs and extract citations with RAG</p>
            </div>
          </div>
        </div>

        {/* Disabled Input Composer */}
        <div className="p-4 border-t border-slate-200/80 bg-white/50 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="max-w-3xl mx-auto relative rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 px-4 py-3.5 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
              <Lock size={16} className="text-slate-400 dark:text-slate-500" />
              <span>Sign in to start chatting with Patwatoli AI...</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Send size={15} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
