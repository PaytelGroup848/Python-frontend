"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Globe, Loader2, Lock } from "lucide-react";
import { updateMiniAI } from "../services/mini-ai-service";
import { MiniAIItem } from "../types/mini-ai.types";

export function StudioDeployTab({
  bot,
  allowPublicEmbed = true,
}: {
  bot: MiniAIItem;
  allowPublicEmbed?: boolean;
}) {
  const queryClient = useQueryClient();
  const [isPublic, setIsPublic] = useState(bot.is_public);
  const [shareSlug, setShareSlug] = useState(bot.share_slug || "");
  const [domainsText, setDomainsText] = useState((bot.allowed_domains || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<"link" | "embed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const effectiveSlug = shareSlug.trim() || bot.share_slug || "";
  const publicUrl = effectiveSlug ? `${appOrigin}/b/${effectiveSlug}` : "";
  const embedScript = effectiveSlug
    ? `<script src="${apiOrigin}/public/widget.js" data-bot="${effectiveSlug}"></script>`
    : "";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const domains = domainsText
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean);
      const updated = await updateMiniAI(bot.id, {
        is_public: isPublic,
        share_slug: shareSlug.trim() || null,
        allowed_domains: domains,
      });
      setShareSlug(updated.share_slug || "");
      await queryClient.invalidateQueries({ queryKey: ["mini-ais"] });
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Failed to update deployment settings.");
    } finally {
      setSaving(false);
    }
  };

  const copyText = async (value: string, kind: "link" | "embed") => {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!allowPublicEmbed) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
          <Lock size={15} /> Paid Feature — Public Share &amp; Website Embed
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Free plan includes 1 private Mini AI (up to 50 chunks). Upgrade to a Paid plan to publish a shareable link, embed the chat widget on your website, and unlock up to 5 Mini AIs (200 chunks each).
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

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <label className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-3 cursor-pointer">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-emerald-600" />
          <div>
            <p className="text-xs font-semibold">Public Access &amp; Website Embed</p>
            <p className="text-[11px] text-slate-500">Allow visitors to chat via share link or widget.</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-emerald-600"
        />
      </label>

      <div>
        <label className="block text-xs font-medium mb-1">Share Slug (lowercase, hyphens)</label>
        <input
          placeholder="my-shop-bot"
          value={shareSlug}
          onChange={(e) => setShareSlug(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Allowed Domains (comma-separated, optional)</label>
        <input
          placeholder="myshop.com, www.myshop.com"
          value={domainsText}
          onChange={(e) => setDomainsText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer"
      >
        {saving && <Loader2 size={14} className="animate-spin" />}
        Save Deployment Settings
      </button>

      {isPublic && effectiveSlug && (
        <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs">
            <span className="truncate">{publicUrl}</span>
            <button type="button" onClick={() => copyText(publicUrl, "link")} className="text-emerald-600 flex items-center gap-1 shrink-0 cursor-pointer">
              {copied === "link" ? <Check size={13} /> : <Copy size={13} />} Copy Link
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-mono">
            <span className="truncate">{embedScript}</span>
            <button type="button" onClick={() => copyText(embedScript, "embed")} className="text-emerald-600 flex items-center gap-1 shrink-0 cursor-pointer font-sans">
              {copied === "embed" ? <Check size={13} /> : <Copy size={13} />} Copy Script
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
