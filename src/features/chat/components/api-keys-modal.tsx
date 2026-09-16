"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  X,
  Code2,
  Sparkles,
  Zap,
  Terminal,
  ShieldCheck,
  ArrowLeft,
  BookOpen,
  Loader2,
} from "lucide-react";
import {
  fetchApiKeys,
  createBackendApiKey,
  disableBackendApiKey,
  fetchUsageOverview,
  UsageOverview,
} from "../services/api-key-service";

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [mounted, setMounted] = useState(false);
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageOverview>({
    total_tokens: 0,
    prompt_tokens: 0,
    completion_tokens: 0,
    monthly_tokens: 0,
    token_limit: 100000,
    remaining_tokens: 100000,
    estimated_cost: 0,
    plan_name: "free",
  });

  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "python">("curl");

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadBackendData = async () => {
    setLoading(true);
    try {
      const [backendKeys, usageStats] = await Promise.all([
        fetchApiKeys(),
        fetchUsageOverview(),
      ]);

      const formattedKeys: ApiKeyItem[] = backendKeys.map((k) => ({
        id: String(k.id),
        name: k.name || "API Key",
        key: k.key || (k.prefix ? `${k.prefix}••••••••••••••••` : "sk_live_••••••••••••••••"),
        created: k.created_at ? new Date(k.created_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Active",
        lastUsed: k.last_used_at ? new Date(k.last_used_at).toLocaleTimeString() : "Never",
      }));

      setKeys(formattedKeys);
      setUsage(usageStats);
    } catch (err) {
      console.error("Error loading backend developer portal data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mounted) {
      loadBackendData();
    }
  }, [isOpen, mounted]);

  if (!isOpen || !mounted) return null;

  const handleGenerateKey = async () => {
    if (!newKeyName.trim() || isCreating) return;
    setIsCreating(true);
    setCreateError(null);
    try {
      const createdKey = await createBackendApiKey(newKeyName.trim());
      const rawKey = createdKey.key || "";
      const prefix = createdKey.prefix || rawKey.slice(0, 14);

      const newItem: ApiKeyItem = {
        id: String(createdKey.id),
        name: createdKey.name || newKeyName.trim(),
        key: prefix ? `${prefix}••••••••••••••••` : "sk_live_••••••••••••••••",
        created: "Just now",
        lastUsed: "Never",
      };

      setKeys([newItem, ...keys]);
      setGeneratedKey(rawKey);
      setNewKeyName("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create API key";
      setCreateError(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevokeKey = async (id: string) => {
    const ok = await disableBackendApiKey(id);
    if (ok) {
      setKeys(keys.filter((k) => k.id !== id));
    }
  };



  const curlCode = `curl "https://api.patwatoliai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${generatedKey || keys[0]?.key || "YOUR_API_KEY"}" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello Patwatoli AI!"}]
  }'`;

  const pythonCode = `import openai

client = openai.OpenAI(
    api_key="${generatedKey || keys[0]?.key || "YOUR_API_KEY"}",
    base_url="https://api.patwatoliai.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello Patwatoli AI!"}]
)
print(response.choices[0].message.content)`;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col animate-in fade-in duration-200">
      {/* DEVELOPER PORTAL TOP NAVBAR */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-xl shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
            <Key size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <span>Patwatoli AI Developer Portal</span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                <Sparkles size={10} /> OpenAI-Compatible v1 API
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              API Keys, Documentation & Metered Usage Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition cursor-pointer active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Back to Chat Workspace</span>
          </button>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* MAIN DEVELOPER PORTAL BODY GRID */}
      <div className="relative flex-1 overflow-y-auto p-6 md:p-8">
        {/* Patwatoli AI Emerald Green Wave Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full bg-emerald-200/40 blur-[120px]" />
          <div className="absolute top-1/4 -left-40 h-[420px] w-[720px] rounded-full bg-teal-200/30 blur-[130px]" />
          <div className="absolute bottom-[-160px] left-[-80px] h-[520px] w-[820px] rounded-full bg-emerald-300/30 blur-[120px]" />
          <div className="absolute bottom-[-220px] right-[-100px] h-[560px] w-[860px] rounded-full bg-teal-100/50 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: API KEYS & GENERATOR (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* CREATE NEW KEY CARD */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-900">
                <Plus size={16} className="text-emerald-600" />
                <span>Create New Secret API Key</span>
              </div>
              <p className="text-xs text-slate-500">
                Name your API key to identify where it is being used (e.g. Production Web App, Mobile Backend).
              </p>

              <div className="flex gap-3 pt-1">
                <input
                  type="text"
                  placeholder="e.g. Production Backend Service"
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    if (createError) setCreateError(null);
                  }}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none shadow-xs font-mono transition"
                />
                <button
                  onClick={handleGenerateKey}
                  disabled={!newKeyName.trim() || isCreating}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/30 transition cursor-pointer active:scale-95"
                >
                  {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  <span>{isCreating ? "Generating..." : "Generate Key"}</span>
                </button>
              </div>

              {createError && (
                <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200 flex items-center gap-2">
                  <X size={15} className="text-red-500 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {generatedKey && (
                <div className="mt-4 rounded-xl bg-emerald-50/80 p-4 border border-emerald-200 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-600" /> Please copy your secret key now!
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium">
                      You won&apos;t be able to view it again.
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-3 text-xs font-mono text-emerald-700 border border-emerald-200 flex items-center justify-between shadow-xs">
                    <div className="truncate pr-3 font-semibold select-all text-slate-800">{generatedKey}</div>
                    <button
                      onClick={() => handleCopy(generatedKey, "gen")}
                      className="flex items-center gap-1.5 shrink-0 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer shadow-xs active:scale-95"
                    >
                      {copiedId === "gen" ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === "gen" ? "Copied!" : "Copy Key"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVE KEYS TABLE */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Key size={16} className="text-emerald-600" />
                  <span>Your Active Secret Keys ({keys.length})</span>
                </span>
                <span className="text-xs text-slate-500 font-medium">Keep your secret keys secure.</span>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {keys.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 italic">No active secret API keys found.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {keys.map((k) => (
                      <div key={k.id} className="flex items-center justify-between p-4 text-xs hover:bg-slate-50 transition">
                        <div className="space-y-1 max-w-[65%]">
                          <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                            <span>{k.name}</span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-emerald-700 border border-slate-200 font-medium">
                              {k.key.substring(0, 16)}••••
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">Created: {k.created} • Last used: {k.lastUsed}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(k.key, k.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition cursor-pointer border border-slate-200 active:scale-95"
                          >
                            {copiedId === k.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                            <span>{copiedId === k.id ? "Copied" : "Copy"}</span>
                          </button>

                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer border border-transparent hover:border-red-200"
                            title="Revoke Key"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: QUICKSTART & METERING (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* OpenAI-COMPATIBLE API QUICKSTART */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Terminal size={16} className="text-emerald-600" />
                  <span>API Integration Quickstart</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 border border-slate-200">
                  <button
                    onClick={() => setActiveCodeTab("curl")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      activeCodeTab === "curl"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("python")}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                      activeCodeTab === "python"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto p-4 bg-slate-950 rounded-xl text-emerald-400 font-mono text-[11px] leading-relaxed border border-slate-800 shadow-inner">
                {activeCodeTab === "curl" ? curlCode : pythonCode}
              </pre>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  Base URL: <code className="rounded bg-slate-100 px-1.5 py-0.5 text-emerald-700 font-mono border border-slate-200">http://localhost:8000/v1</code>
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <BookOpen size={13} /> OpenAI SDK Ready
                </span>
              </div>
            </div>

            {/* LIVE USAGE & BILLING METER */}
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" /> Live Monthly Token Usage
                </span>
                <span className="font-mono text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {loading
                    ? "Loading..."
                    : `${(usage.monthly_tokens || usage.total_tokens).toLocaleString()} / ${usage.token_limit.toLocaleString()}`}
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        1,
                        ((usage.monthly_tokens || usage.total_tokens) / (usage.token_limit || 100000)) * 100
                      )
                    )}%`,
                  }}
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Prompt Tokens</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {usage.prompt_tokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Completion Tokens</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {usage.completion_tokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Remaining Balance</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    {usage.remaining_tokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 border-t border-slate-200 pt-2">
                  <span>Estimated Total Usage Cost</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    ${usage.estimated_cost.toFixed(4)} USD
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-200">
                  <span>Subscription Plan</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 uppercase">
                    <ShieldCheck size={14} /> {usage.plan_name} Tier
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

