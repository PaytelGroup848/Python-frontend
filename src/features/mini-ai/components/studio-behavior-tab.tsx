"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { updateMiniAI } from "../services/mini-ai-service";
import { MiniAIItem } from "../types/mini-ai.types";

export function StudioBehaviorTab({ bot }: { bot: MiniAIItem }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(bot.name);
  const [description, setDescription] = useState(bot.description || "");
  const [systemPrompt, setSystemPrompt] = useState(bot.system_prompt || "");
  const [welcomeMessage, setWelcomeMessage] = useState(bot.welcome_message || "");
  const [strictRag, setStrictRag] = useState(bot.strict_rag);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      await updateMiniAI(bot.id, {
        name,
        description,
        system_prompt: systemPrompt,
        welcome_message: welcomeMessage,
        strict_rag: strictRag,
      });
      await queryClient.invalidateQueries({ queryKey: ["mini-ais"] });
      await queryClient.invalidateQueries({ queryKey: ["assistants"] });
      setStatusMsg("Behavior settings saved.");
    } catch {
      setStatusMsg("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1">Bot Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">System Instructions</label>
        <textarea
          required
          rows={4}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Public Welcome Message</label>
        <input
          placeholder="Hi! Ask me anything about our products or services."
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
        />
      </div>

      <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer">
        <div>
          <p className="text-xs font-semibold">Strict Grounding Mode</p>
          <p className="text-[11px] text-slate-500">
            Answer strictly from uploaded knowledge; trigger fallback &amp; log gap when unsure.
          </p>
        </div>
        <input
          type="checkbox"
          checked={strictRag}
          onChange={(e) => setStrictRag(e.target.checked)}
          className="h-4 w-4 accent-emerald-600"
        />
      </label>

      {statusMsg && <p className="text-xs text-emerald-600">{statusMsg}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer"
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Save Behavior
      </button>
    </form>
  );
}
