import { useState } from "react";
import { CornerDownRight } from "lucide-react";

interface RecommendedSuggestionsProps {
  suggestions: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function RecommendedSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: RecommendedSuggestionsProps) {
  const [clickedPrompt, setClickedPrompt] = useState<string | null>(null);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const handleClick = (prompt: string) => {
    if (disabled || clickedPrompt) return;
    setClickedPrompt(prompt);
    onSelect(prompt);
  };

  return (
    <div className="mt-2.5 flex flex-col gap-0.5 w-full max-w-3xl pt-2 border-t border-slate-100 dark:border-zinc-800/60">
      {suggestions.map((prompt, idx) => {
        const isClicked = clickedPrompt === prompt;
        return (
          <button
            key={`${idx}-${prompt}`}
            type="button"
            disabled={disabled || Boolean(clickedPrompt)}
            onClick={() => handleClick(prompt)}
            className={`group flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg text-left transition-all cursor-pointer ${
              isClicked
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-slate-800 dark:text-zinc-100 hover:bg-slate-100/90 dark:hover:bg-zinc-800/80 active:scale-[0.99]"
            } ${disabled || clickedPrompt ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Click to send follow-up"
          >
            <CornerDownRight
              size={15}
              className={`shrink-0 mt-0.5 transition-transform ${
                isClicked
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5"
              }`}
            />
            <span className="text-[13.5px] sm:text-sm font-medium leading-snug">
              {prompt}
            </span>
          </button>
        );
      })}
    </div>
  );
}
