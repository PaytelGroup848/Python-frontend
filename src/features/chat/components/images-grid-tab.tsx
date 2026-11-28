"use client";

import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import type { WebImageItem } from "../utils/source-parser";

interface ImagesGridTabProps {
  images: WebImageItem[];
}

export function ImagesGridTab({ images }: ImagesGridTabProps) {
  const [selected, setSelected] = useState<WebImageItem | null>(null);
  const [brokenUrls, setBrokenUrls] = useState<Record<string, boolean>>({});

  const visibleImages = images.filter((img) => !brokenUrls[img.url]);

  if (visibleImages.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        No images available for this query.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 py-1">
        {visibleImages.map((img, idx) => (
          <button
            key={`${img.url}-${idx}`}
            type="button"
            onClick={() => setSelected(img)}
            className="group relative aspect-4/3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <img
              src={img.thumbnail || img.url}
              alt={img.title || "Search result image"}
              loading="lazy"
              onError={() => setBrokenUrls((prev) => ({ ...prev, [img.url]: true }))}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {(img.title || img.domain) && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {img.title && (
                  <p className="line-clamp-1 text-[11px] font-medium text-white">
                    {img.title}
                  </p>
                )}
                {img.domain && (
                  <p className="line-clamp-1 text-[10px] text-slate-300">
                    {img.domain}
                  </p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-3xl w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <div className="min-w-0 pr-4">
                <p className="truncate text-sm font-semibold text-white">
                  {selected.title || "Image Preview"}
                </p>
                {selected.domain && (
                  <p className="truncate text-xs text-slate-400">{selected.domain}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selected.source_url && (
                  <a
                    href={selected.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <span>Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close image preview"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex max-h-[75vh] items-center justify-center bg-black p-2">
              <img
                src={selected.url}
                alt={selected.title || "Preview"}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
