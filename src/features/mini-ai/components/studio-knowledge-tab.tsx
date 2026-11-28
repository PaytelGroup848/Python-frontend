"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Loader2, Plus, Trash2, Upload } from "lucide-react";
import {
  addMiniAIKnowledge,
  deleteMiniAIDocument,
  listMiniAIDocuments,
} from "../services/mini-ai-service";
import { QAPairInput } from "../types/mini-ai.types";

export function StudioKnowledgeTab({ miniAiId }: { miniAiId: number }) {
  const queryClient = useQueryClient();
  const [qaPairs, setQaPairs] = useState<QAPairInput[]>([{ question: "", answer: "" }]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["mini-ai-docs", miniAiId],
    queryFn: () => listMiniAIDocuments(miniAiId),
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["mini-ai-docs", miniAiId] });
    await queryClient.invalidateQueries({ queryKey: ["mini-ais"] });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await addMiniAIKnowledge(miniAiId, { qa_pairs: qaPairs, file });
      setQaPairs([{ question: "", answer: "" }]);
      setFile(null);
      await refresh();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Failed to index knowledge.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoc = async (docId: number) => {
    setDeletingDocId(docId);
    setError(null);
    try {
      await deleteMiniAIDocument(miniAiId, docId);
      await refresh();
    } catch {
      setError("Failed to delete document.");
    } finally {
      setDeletingDocId(null);
    }
  };

  const used = data?.chunks_used ?? 0;
  const limit = data?.chunk_limit ?? 200;
  const pct = Math.min(100, Math.round((used / limit) * 100));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span>Chunk Quota Usage</span>
          <span>{used} / {limit} chunks</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Add Files or Q&amp;A</span>
          <button
            type="button"
            onClick={() => setQaPairs([...qaPairs, { question: "", answer: "" }])}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:underline cursor-pointer"
          >
            <Plus size={12} /> Add Q&amp;A
          </button>
        </div>
        {qaPairs.map((pair, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              placeholder="Question"
              value={pair.question}
              onChange={(e) => {
                const next = [...qaPairs];
                next[idx] = { ...next[idx], question: e.target.value };
                setQaPairs(next);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-1.5 text-xs"
            />
            <input
              placeholder="Answer"
              value={pair.answer}
              onChange={(e) => {
                const next = [...qaPairs];
                next[idx] = { ...next[idx], answer: e.target.value };
                setQaPairs(next);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-1.5 text-xs"
            />
          </div>
        ))}
        <label className="flex items-center justify-between rounded-xl border border-dashed border-slate-300 dark:border-slate-700 px-3 py-2.5 cursor-pointer">
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
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? "Indexing..." : "Upload & Index"}
        </button>
      </form>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Indexed Documents
        </h3>
        {isLoading ? (
          <p className="text-xs text-slate-500">Loading documents...</p>
        ) : (data?.documents.length || 0) === 0 ? (
          <p className="text-xs text-slate-500">No documents indexed yet.</p>
        ) : (
          data?.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-emerald-600 shrink-0" />
                <span className="font-medium truncate">{doc.file_name}</span>
                <span className="text-[11px] text-slate-500 shrink-0">
                  ({doc.chunk_count} chunks · {doc.status})
                </span>
              </div>
              <button
                onClick={() => handleDeleteDoc(doc.id)}
                disabled={deletingDocId === doc.id}
                className="text-red-500 hover:text-red-400 p-1 cursor-pointer"
                title="Delete document"
              >
                {deletingDocId === doc.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
