"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Globe, X } from "lucide-react";
import type { WebSourceItem } from "../utils/source-parser";

interface SourcesRailProps {
  isOpen: boolean;
  sources: WebSourceItem[];
  highlightedIndex: number | null;
  onClose: () => void;
}

function RailFavicon({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
        <Globe size={11} />
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`}
      alt=""
      width={16}
      height={16}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-4 w-4 shrink-0 rounded-xs object-contain"
    />
  );
}

export function SourcesRail({
  isOpen,
  sources,
  highlightedIndex,
  onClose,
}: SourcesRailProps) {
  const cardRefs = useRef<Record<number, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (!isOpen || highlightedIndex === null) return;
    const target = cardRefs.current[highlightedIndex];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isOpen, highlightedIndex]);

  if (!isOpen || !sources || sources.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Sources panel"
      className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl lg:static lg:z-auto lg:w-85 xl:w-92 lg:shrink-0 lg:shadow-none"
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Globe size={15} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Sources
          </h2>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {sources.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sources panel"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sources.map((src) => {
          const isHighlighted = highlightedIndex === src.index;
          return (
            <a
              key={`${src.index}-${src.url}`}
              ref={(el) => {
                cardRefs.current[src.index] = el;
              }}
              href={src.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block rounded-xl border p-3 transition-all ${
                isHighlighted
                  ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/25"
                  : "border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-400/70 hover:bg-white dark:hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <RailFavicon domain={src.domain} />
                  <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {src.domain || "Web Source"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="flex h-4 min-w-4 items-center justify-center rounded bg-slate-200/80 dark:bg-slate-700 px-1 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    {src.index}
                  </span>
                  <ExternalLink
                    size={12}
                    className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {src.title}
              </h3>

              {src.snippet && (
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {src.snippet}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </aside>
  );
}
