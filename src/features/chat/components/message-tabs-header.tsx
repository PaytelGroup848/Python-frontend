"use client";

import { Sparkles, Globe, Image as ImageIcon } from "lucide-react";

export type ResponseTab = "answer" | "links" | "images";

interface MessageTabsHeaderProps {
  activeTab: ResponseTab;
  onTabChange: (tab: ResponseTab) => void;
  linksCount: number;
  imagesCount: number;
}

export function MessageTabsHeader({
  activeTab,
  onTabChange,
  linksCount,
  imagesCount,
}: MessageTabsHeaderProps) {
  if (linksCount === 0 && imagesCount === 0) {
    return null;
  }

  const tabs: {
    id: ResponseTab;
    label: string;
    icon: typeof Sparkles;
    count?: number;
    visible: boolean;
  }[] = [
    { id: "answer", label: "Answer", icon: Sparkles, visible: true },
    { id: "links", label: "Links", icon: Globe, count: linksCount, visible: linksCount > 0 },
    { id: "images", label: "Images", icon: ImageIcon, count: imagesCount, visible: imagesCount > 0 },
  ];

  return (
    <div
      className="mb-3 flex items-center gap-1 border-b border-slate-200/80 dark:border-slate-800/80"
      role="tablist"
      aria-label="Response views"
    >
      {tabs
        .filter((t) => t.visible)
        .map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                size={14}
                className={isActive ? "text-emerald-600 dark:text-emerald-400" : ""}
              />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              )}
            </button>
          );
        })}
    </div>
  );
}
