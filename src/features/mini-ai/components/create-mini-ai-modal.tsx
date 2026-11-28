"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Bot, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { addMiniAIKnowledge, createMiniAI, deleteMiniAI } from "../services/mini-ai-service";
import { QAPairInput } from "../types/mini-ai.types";
import { Assistant } from "@/features/playground/types/assistant";

interface CreateMiniAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (assistantId: number) => void;
  existingMiniAIs: Assistant[];
}

export function CreateMiniAIModal({
  isOpen,
  onClose,
  onCreated,
  existingMiniAIs,
}: CreateMiniAIModalProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful personal assistant. Answer strictly using the provided knowledge when available."
  );
  const [qaPairs, setQaPairs] = useState<QAPairInput[]>([{ question: "", answer: "" }]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [targetBot, setTargetBot] = useState<Assistant | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || typeof document === "undefined") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = targetBot
        ? await addMiniAIKnowledge(targetBot.id, { qa_pairs: qaPairs, file })
        : await createMiniAI({
            name,
            description,
            system_prompt: systemPrompt,
            qa_pairs: qaPairs,
            file,
          });
      await queryClient.invalidateQueries({ queryKey: ["assistants"] });
      setName("");
      setDescription("");
      setQaPairs([{ question: "", answer: "" }]);
      setFile(null);
      setTargetBot(null);
      onCreated(result.id);
      onClose();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data
        ?.detail;
      setError(detail || "Failed to save Mini AI");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteMiniAI(id);
      await queryClient.invalidateQueries({ queryKey: ["assistants"] });
    } catch {
      setError("Failed to delete Mini AI");
    } finally {
      setDeletingId(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {targetBot ? `Add Knowledge to ${targetBot.name}` : "My Mini AI (Private Knowledge Bot)"}
            </h2>
          </div>
          <button
            onClick={() => {
              setTargetBot(null);
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {!targetBot && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Mini AI Name (e.g. Shop Support)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
                />
                <input
                  placeholder="Short description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Instructions / System Prompt..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
              />
            </>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Custom Q&amp;A Knowledge (Optional)
              </span>
              <button
                type="button"
                onClick={() => setQaPairs([...qaPairs, { question: "", answer: "" }])}
                className="flex items-center gap-1 text-[11px] text-emerald-600 hover:underline"
              >
                <Plus size={12} /> Add Q&amp;A
              </button>
            </div>
            {qaPairs.map((pair, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Question"
                  value={pair.question}
                  onChange={(e) => {
                    const next = [...qaPairs];
                    next[idx] = { ...next[idx], question: e.target.value };
                    setQaPairs(next);
                  }}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2.5 py-1.5 text-xs"
                />
                <input
                  placeholder="Answer"
                  value={pair.answer}
                  onChange={(e) => {
                    const next = [...qaPairs];
                    next[idx] = { ...next[idx], answer: e.target.value };
                    setQaPairs(next);
                  }}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2.5 py-1.5 text-xs"
                />
              </div>
            ))}
          </div>

          <label className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-3 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40">
            <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <Upload size={14} />
              {file ? file.name : "Upload .txt, .csv, .pdf, .docx, or .xlsx (Max 5 MB)"}
            </span>
            <input
              type="file"
              accept=".txt,.csv,.pdf,.docx,.xlsx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className="flex gap-2">
            {targetBot && (
              <button
                type="button"
                onClick={() => setTargetBot(null)}
                className="px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-semibold disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {isSubmitting
                ? "Indexing..."
                : targetBot
                ? `Append Knowledge to ${targetBot.name}`
                : "Create My Mini AI"}
            </button>
          </div>
        </form>

        {existingMiniAIs.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Your Mini AIs ({existingMiniAIs.length}/5)
            </p>
            {existingMiniAIs.map((bot) => (
              <div
                key={bot.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs"
              >
                <span className="font-medium truncate">{bot.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setTargetBot(bot);
                    }}
                    className="text-[11px] font-medium text-emerald-600 hover:underline cursor-pointer"
                  >
                    + Add Data
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === bot.id}
                    onClick={() => handleDelete(bot.id)}
                    className="text-red-500 hover:text-red-400 p-1 cursor-pointer"
                    title="Delete Mini AI"
                  >
                    {deletingId === bot.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
