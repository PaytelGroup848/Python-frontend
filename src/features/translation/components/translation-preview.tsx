"use client";

import { DocumentBlock } from "../types/translation";

interface TranslationPreviewProps {
  originalBlocks?: DocumentBlock[] | null;
  translatedBlocks?: DocumentBlock[] | null;
  sourceLanguage: string;
  targetLanguage: string;
}

function RenderBlockList({ blocks }: { blocks?: DocumentBlock[] | null }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 dark:text-slate-500 italic">
        No preview content available yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((b) => {
        if (b.type === "heading") {
          const Tag = b.level === 1 ? "h2" : b.level === 2 ? "h3" : "h4";
          return (
            <Tag
              key={b.block_id}
              className={`font-bold text-slate-900 dark:text-white ${
                b.level === 1 ? "text-base pt-2 border-b border-slate-100 dark:border-zinc-800 pb-1" : "text-sm pt-1"
              }`}
            >
              {b.text}
            </Tag>
          );
        }

        if (b.type === "list_item") {
          const indentStyle = { paddingLeft: `${(b.list_level || 0) * 16}px` };
          return (
            <div key={b.block_id} style={indentStyle} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                {b.list_type === "numbered" ? "1." : "•"}
              </span>
              <span>{b.text}</span>
            </div>
          );
        }

        if (b.type === "table" && b.rows && b.rows.length > 0) {
          return (
            <div key={b.block_id} className="overflow-x-auto my-2 rounded-xl border border-slate-200 dark:border-zinc-750">
              <table className="w-full text-xs text-left text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-100 dark:bg-zinc-800/80 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-zinc-700 font-semibold">
                    {b.rows[0].map((headerCell, cIdx) => (
                      <th key={cIdx} className="px-3 py-2">
                        {headerCell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {b.rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={b.block_id} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

export function TranslationPreview({
  originalBlocks,
  translatedBlocks,
  sourceLanguage,
  targetLanguage,
}: TranslationPreviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[380px]">
      {/* Left Pane: Original Document */}
      <div className="flex flex-col h-full bg-slate-50/70 dark:bg-zinc-850/50 border border-slate-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/70 dark:bg-zinc-800/70 border-b border-slate-200/80 dark:border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Original ({sourceLanguage.toUpperCase()})
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {originalBlocks?.length || 0} blocks
          </span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <RenderBlockList blocks={originalBlocks} />
        </div>
      </div>

      {/* Right Pane: Translated Document */}
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/50">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Translated ({targetLanguage.toUpperCase()})
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {translatedBlocks?.length || 0} blocks
          </span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <RenderBlockList blocks={translatedBlocks} />
        </div>
      </div>
    </div>
  );
}
