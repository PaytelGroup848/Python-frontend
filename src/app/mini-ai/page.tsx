"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bot, Plus } from "lucide-react";
import { getMiniAIEntitlements, listMiniAIs } from "@/features/mini-ai/services/mini-ai-service";
import { StudioKnowledgeTab } from "@/features/mini-ai/components/studio-knowledge-tab";
import { StudioBehaviorTab } from "@/features/mini-ai/components/studio-behavior-tab";
import { StudioDeployTab } from "@/features/mini-ai/components/studio-deploy-tab";
import { StudioInsightsTab } from "@/features/mini-ai/components/studio-insights-tab";
import { CreateMiniAIModal } from "@/features/mini-ai/components/create-mini-ai-modal";
import { useAssistants } from "@/features/playground/hooks/use-assistants";

type StudioTab = "knowledge" | "behavior" | "deploy" | "insights";

export default function MiniAIStudioPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<StudioTab>("knowledge");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: bots = [], isLoading, refetch } = useQuery({
    queryKey: ["mini-ais"],
    queryFn: listMiniAIs,
  });
  const { data: entitlements } = useQuery({
    queryKey: ["mini-ai-entitlements"],
    queryFn: getMiniAIEntitlements,
  });
  const { data: assistants = [] } = useAssistants();

  const maxBots = entitlements?.max_bots ?? 1;
  const maxChunks = entitlements?.max_chunks_per_bot ?? 50;

  const activeBot = bots.find((b) => b.id === selectedId) || bots[0] || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            >
              <ArrowLeft size={14} /> Back to Chat
            </Link>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Bot size={20} className="text-emerald-600" />
              My Mini AI Studio
            </h1>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} /> Create Mini AI
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-xs text-slate-500">
            Loading your Mini AIs...
          </div>
        ) : bots.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-3">
            <p className="text-sm font-medium">You have not created any Mini AIs yet.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
            >
              Create Your First Mini AI
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <aside className="space-y-1.5">
              {bots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => setSelectedId(bot.id)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 text-xs border transition cursor-pointer ${
                    activeBot?.id === bot.id
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="truncate">{bot.name}</div>
                  <div className="text-[10px] opacity-80">
                    {bot.chunks_count}/{maxChunks} chunks {bot.is_public ? "· Public" : ""}
                  </div>
                </button>
              ))}
            </aside>

            {activeBot && (
              <main className="md:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  {(
                    [
                      ["knowledge", "Knowledge"],
                      ["behavior", "Behavior"],
                      ["deploy", "Deploy & Embed"],
                      ["insights", "Leads & Gaps"],
                    ] as [StudioTab, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        activeTab === id
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {activeTab === "knowledge" && <StudioKnowledgeTab miniAiId={activeBot.id} />}
                {activeTab === "behavior" && <StudioBehaviorTab key={activeBot.id} bot={activeBot} />}
                {activeTab === "deploy" && (
                  <StudioDeployTab
                    key={activeBot.id}
                    bot={activeBot}
                    allowPublicEmbed={entitlements?.allow_public_embed ?? false}
                  />
                )}
                {activeTab === "insights" && (
                  <StudioInsightsTab
                    miniAiId={activeBot.id}
                    allowInsights={entitlements?.allow_insights ?? false}
                  />
                )}
              </main>
            )}
          </div>
        )}
      </div>

      <CreateMiniAIModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(id) => {
          setSelectedId(id);
          refetch();
        }}
        existingMiniAIs={assistants.filter((a) => a.is_custom)}
      />
    </div>
  );
}
