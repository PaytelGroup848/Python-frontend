"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Lock, Sparkles, Users } from "lucide-react";
import { getMiniAIInsights, trainMiniAIGap } from "../services/mini-ai-service";

export function StudioInsightsTab({
  miniAiId,
  allowInsights = true,
}: {
  miniAiId: number;
  allowInsights?: boolean;
}) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [trainingId, setTrainingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["mini-ai-insights", miniAiId],
    queryFn: () => getMiniAIInsights(miniAiId),
    enabled: allowInsights,
  });

  if (!allowInsights) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
          <Lock size={15} /> Paid Feature — Visitor Leads &amp; Knowledge Gaps
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Upgrade to a Paid plan to capture visitor leads and train your bot on unanswered questions in 1 click.
        </p>
        <Link
          href="/upgrade"
          className="inline-flex items-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold"
        >
          Upgrade Plan →
        </Link>
      </div>
    );
  }

  const handleTrain = async (gapId: number) => {
    const answer = (answers[gapId] || "").trim();
    if (!answer) return;
    setTrainingId(gapId);
    try {
      await trainMiniAIGap(miniAiId, gapId, answer);
      await queryClient.invalidateQueries({ queryKey: ["mini-ai-insights", miniAiId] });
      await queryClient.invalidateQueries({ queryKey: ["mini-ai-docs", miniAiId] });
    } finally {
      setTrainingId(null);
    }
  };

  if (isLoading) return <p className="text-xs text-slate-500">Loading insights...</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles size={13} /> Unanswered Knowledge Gaps ({data?.total_gaps ?? 0})
        </h3>
        {(data?.gaps.length || 0) === 0 ? (
          <p className="text-xs text-slate-500">No unanswered questions logged yet.</p>
        ) : (
          data?.gaps.map((gap) => (
            <div key={gap.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium">{gap.question}</span>
                <span className="text-[11px] text-slate-500">
                  {gap.hit_count}x · {gap.resolved ? "Resolved" : "Open"}
                </span>
              </div>
              {gap.resolved ? (
                <div className="flex items-center gap-1 text-emerald-600 text-[11px]">
                  <CheckCircle2 size={12} /> Trained into knowledge base
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    placeholder="Type verified answer to train bot..."
                    value={answers[gap.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [gap.id]: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-2.5 py-1.5 text-xs"
                  />
                  <button
                    onClick={() => handleTrain(gap.id)}
                    disabled={trainingId === gap.id}
                    className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {trainingId === gap.id && <Loader2 size={12} className="animate-spin" />}
                    Train Answer
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Users size={13} /> Captured Leads ({data?.total_leads ?? 0})
        </h3>
        {(data?.leads.length || 0) === 0 ? (
          <p className="text-xs text-slate-500">No leads captured yet.</p>
        ) : (
          data?.leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs flex justify-between">
              <div>
                <p className="font-semibold">{lead.visitor_name}</p>
                <p className="text-slate-500">{lead.visitor_contact}</p>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
