"use client";

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Globe, ChevronDown, ExternalLink, FileText } from "lucide-react";
import type { WebSourceItem, DocumentSourceItem } from "../utils/source-parser";

interface SourcesDropdownProps {
  sources: WebSourceItem[];
  documentSources?: DocumentSourceItem[];
  initialOpen?: boolean;
}

export interface SourcesDropdownHandle {
  highlightSource: (index: number) => void;
  open: () => void;
  close: () => void;
}

function SourceFavicon({ domain }: { domain: string }) {
  const [failed, setFailed] = useState(false);

  if (!domain || failed) {
    return (
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
        <Globe size={12} />
      </div>
    );
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`}
      alt=""
      width={16}
      height={16}
      className="h-4 w-4 shrink-0 rounded-xs object-contain"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export const SourcesDropdown = forwardRef<SourcesDropdownHandle, SourcesDropdownProps>(
  function SourcesDropdown({ sources, documentSources = [], initialOpen = false }, ref) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);
    const sourceRefs = useRef<Record<number, HTMLAnchorElement | HTMLDivElement | null>>({});

    useImperativeHandle(ref, () => ({
      highlightSource(index: number) {
        setIsOpen(true);
        setActiveSourceIndex(index);
        setTimeout(() => {
          const el = sourceRefs.current[index];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 100);

        setTimeout(() => {
          setActiveSourceIndex(null);
        }, 2500);
      },
      open() {
        setIsOpen(true);
      },
      close() {
        setIsOpen(false);
      },
    }));

    if ((!sources || sources.length === 0) && (!documentSources || documentSources.length === 0)) {
      return null;
    }

    return (
      <div className="my-2.5 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/60 transition-all dark:border-slate-800 dark:bg-slate-900/40">
        {/* HEADER / TOGGLE BAR */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/70 transition-colors dark:text-slate-200 dark:hover:bg-slate-800/60 cursor-pointer"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Globe size={13} />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Sources
            </span>
            {sources.length > 0 && (
              <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                {sources.length}
              </span>
            )}
            {documentSources.length > 0 && (
              <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                {documentSources.length} Doc{documentSources.length > 1 ? "s" : ""}
              </span>
            )}

            {/* DOMAIN PREVIEW PILLS (Collapsed state) */}
            {!isOpen && sources.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 ml-1 overflow-hidden">
                {sources.slice(0, 3).map((s) => (
                  <span
                    key={s.index}
                    className="truncate max-w-[110px] rounded-sm bg-slate-200/70 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {s.domain || `Source ${s.index}`}
                  </span>
                ))}
                {sources.length > 3 && (
                  <span className="text-[10px] text-slate-400">
                    +{sources.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px]">{isOpen ? "Hide" : "Show"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* EXPANDED DROPDOWN CONTENT */}
        {isOpen && (
          <div className="border-t border-slate-200/60 p-2.5 transition-all dark:border-slate-800/80">
            {/* WEB SOURCES GRID */}
            {sources.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sources.map((source) => {
                  const isActive = activeSourceIndex === source.index;
                  const hasUrl = Boolean(source.url);

                  const CardWrapper = hasUrl ? "a" : "div";
                  const cardProps = hasUrl
                    ? {
                        href: source.url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : {};

                  return (
                    <CardWrapper
                      key={source.index}
                      {...cardProps}
                      ref={(el: HTMLAnchorElement | HTMLDivElement | null) => {
                        sourceRefs.current[source.index] = el;
                      }}
                      className={`group relative flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/40 dark:border-emerald-500 dark:bg-emerald-950/40"
                          : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 dark:hover:bg-slate-800/60"
                      } ${hasUrl ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {/* SOURCE INDEX BADGE */}
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors dark:bg-slate-800 dark:text-slate-300">
                        {source.index}
                      </span>

                      {/* SOURCE DETAILS */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <SourceFavicon domain={source.domain} />
                          <span className="truncate text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {source.domain || "Web Resource"}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-800 group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-400 transition-colors">
                          {source.title}
                        </p>
                      </div>

                      {/* EXTERNAL LINK ICON */}
                      {hasUrl && (
                        <ExternalLink
                          size={13}
                          className="shrink-0 text-slate-400 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 transition-colors mt-0.5"
                        />
                      )}
                    </CardWrapper>
                  );
                })}
              </div>
            )}

            {/* DOCUMENT CITATIONS SECTION */}
            {documentSources.length > 0 && (
              <div className={`${sources.length > 0 ? "mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800" : ""}`}>
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <FileText size={13} className="text-blue-500" />
                  <span>Referenced Documents</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {documentSources.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      <FileText size={12} className="text-blue-500 shrink-0" />
                      <span className="font-medium truncate max-w-[220px]">
                        {doc.filename}
                      </span>
                      {doc.page && (
                        <span className="rounded-sm bg-blue-50 px-1 py-0.2 text-[10px] font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                          p. {doc.page}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);
