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
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 italic">
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
              className={`font-bold text-slate-900 ${
                b.level === 1 ? "text-base pt-2 border-b border-slate-100 pb-1" : "text-sm pt-1"
              }`}
            >
              {b.text}
            </Tag>
          );
        }

        if (b.type === "list_item") {
          const indentStyle = { paddingLeft: `${(b.list_level || 0) * 16}px` };
          return (
            <div key={b.block_id} style={indentStyle} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="text-emerald-600 font-bold shrink-0">
                {b.list_type === "numbered" ? "1." : "•"}
              </span>
              <span>{b.text}</span>
            </div>
          );
        }

        if (b.type === "table" && b.rows && b.rows.length > 0) {
          return (
            <div key={b.block_id} className="overflow-x-auto my-2 rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-xs text-left text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-slate-900 border-b border-slate-200 font-semibold">
                    {b.rows[0].map((headerCell, cIdx) => (
                      <th key={cIdx} className="px-3 py-2">
                        {headerCell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {b.rows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80">
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
          <p key={b.block_id} className="text-xs text-slate-700 leading-relaxed">
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
      <div className="flex flex-col h-full bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100/80 border-b border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Original ({sourceLanguage.toUpperCase()})
          </span>
          <span className="text-[11px] text-slate-400">
            {originalBlocks?.length || 0} blocks
          </span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50/40">
          <RenderBlockList blocks={originalBlocks} />
        </div>
      </div>

      {/* Right Pane: Translated Document */}
      <div className="flex flex-col h-full bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-50/80 border-b border-emerald-100">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Translated ({targetLanguage.toUpperCase()})
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">
            {translatedBlocks?.length || 0} blocks
          </span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-white">
          <RenderBlockList blocks={translatedBlocks} />
        </div>
      </div>
    </div>
  );
}
