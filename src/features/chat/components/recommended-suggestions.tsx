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
    <div className="mt-2 flex flex-col gap-0.5 w-full max-w-3xl">
      {suggestions.map((prompt, idx) => {
        const isClicked = clickedPrompt === prompt;
        return (
          <button
            key={`${idx}-${prompt}`}
            type="button"
            disabled={disabled || Boolean(clickedPrompt)}
            onClick={() => handleClick(prompt)}
            className={`group flex items-start gap-2.5 py-1.5 px-2 rounded-lg text-left transition-all cursor-pointer ${
              isClicked
                ? "bg-emerald-50 text-emerald-800 font-medium"
                : "hover:bg-slate-100/90 active:scale-[0.99]"
            } ${clickedPrompt ? "opacity-60 cursor-not-allowed" : ""}`}
            title="Click to send follow-up"
          >
            <CornerDownRight
              size={15}
              className={`shrink-0 mt-0.5 transition-transform ${
                isClicked
                  ? "text-emerald-600"
                  : "text-slate-600 group-hover:text-emerald-600 group-hover:translate-x-0.5"
              }`}
            />
            <span className="text-[13.5px] sm:text-sm font-semibold leading-snug text-slate-800">
              {prompt}
            </span>
          </button>
        );
      })}
    </div>
  );
}
