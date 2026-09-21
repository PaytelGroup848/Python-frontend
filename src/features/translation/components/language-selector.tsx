"use client";

import { useState } from "react";
import { SupportedLanguage } from "../types/translation";
import { Check, ChevronDown, Search } from "lucide-react";

interface LanguageSelectorProps {
  label: string;
  languages: SupportedLanguage[];
  selectedCode: string;
  onSelect: (code: string) => void;
  allowAutoDetect?: boolean;
}

export function LanguageSelector({
  label,
  languages,
  selectedCode,
  onSelect,
  allowAutoDetect = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLanguages = languages.filter((lang) => {
    const query = search.toLowerCase();
    return (
      lang.display_name.toLowerCase().includes(query) ||
      lang.native_name.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  });

  const currentSelection =
    selectedCode === "auto"
      ? { code: "auto", display_name: "Auto-Detect", native_name: "Auto" }
      : languages.find((l) => l.code === selectedCode) || {
          code: selectedCode,
          display_name: selectedCode,
          native_name: selectedCode,
        };

  return (
    <div className="relative flex-1">
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors shadow-xs"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {currentSelection.native_name}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs">
            ({currentSelection.display_name})
          </span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
            <div className="p-2 border-b border-slate-100 dark:border-zinc-800">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-zinc-800 rounded-lg outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto p-1 text-xs">
              {allowAutoDetect && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect("auto");
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCode === "auto"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <span>Auto-Detect Language</span>
                  {selectedCode === "auto" && <Check size={14} className="text-emerald-600" />}
                </button>
              )}

              {filteredLanguages.map((lang) => {
                const isSelected = lang.code === selectedCode;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      onSelect(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">{lang.native_name}</span>
                      <span className="text-slate-400 dark:text-slate-500">({lang.display_name})</span>
                    </div>
                    {isSelected && <Check size={14} className="text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

