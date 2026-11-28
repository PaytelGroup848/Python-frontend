"use client";

import { use, useEffect, useState } from "react";
import { Bot, Loader2, Send, UserPlus } from "lucide-react";
import {
  getPublicBotInfo,
  sendPublicBotMessage,
  submitPublicLead,
} from "@/features/mini-ai/services/mini-ai-service";
import { PublicBotInfo } from "@/features/mini-ai/types/mini-ai.types";

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function PublicBotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [info, setInfo] = useState<PublicBotInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);

  useEffect(() => {
    getPublicBotInfo(slug)
      .then((d) => {
        setInfo(d);
        if (d.welcome_message) {
          setMessages([{ role: "assistant", content: d.welcome_message }]);
        }
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || sending) return;
    setInput("");
    const nextHistory = [...messages, { role: "user" as const, content: q }];
    setMessages(nextHistory);
    setSending(true);
    try {
      const res = await sendPublicBotMessage(
        slug,
        q,
        messages.slice(-4).map((m) => ({ role: m.role, content: m.content }))
      );
      setMessages([...nextHistory, { role: "assistant", content: res.answer, sources: res.sources }]);
      if (res.fallback_triggered) setShowLeadForm(true);
    } catch {
      setMessages([...nextHistory, { role: "assistant", content: "Unable to get a response right now. Please try again." }]);
    } finally {
      setSending(false);
    }
  };

  const handleLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPublicLead(slug, {
      visitor_name: leadName,
      visitor_contact: leadContact,
      first_question: messages.find((m) => m.role === "user")?.content,
    });
    setLeadSaved(true);
    setShowLeadForm(false);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-slate-500">
        This AI assistant is private or unavailable.
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-sm text-slate-500">
        Loading assistant...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-3 sm:p-6">
      <div className="w-full max-w-2xl flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
        <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <h1 className="text-sm font-bold">{info.name}</h1>
              {info.description && <p className="text-[11px] text-slate-500">{info.description}</p>}
            </div>
          </div>
          <button
            onClick={() => setShowLeadForm(!showLeadForm)}
            className="text-xs font-medium text-emerald-600 flex items-center gap-1 cursor-pointer"
          >
            <UserPlus size={14} /> Contact Team
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 size={14} className="animate-spin" /> Thinking...
            </div>
          )}
          {leadSaved && (
            <p className="text-xs text-emerald-600">Thanks! Our team has received your contact details.</p>
          )}
        </div>

        {showLeadForm && (
          <form onSubmit={handleLead} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              required
              placeholder="Your Name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs"
            />
            <input
              required
              placeholder="Phone / Email"
              value={leadContact}
              onChange={(e) => setLeadContact(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs"
            />
            <button type="submit" className="rounded-lg bg-emerald-600 text-white text-xs font-semibold py-1.5 cursor-pointer">
              Send Details
            </button>
          </form>
        )}

        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-xs outline-none"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
