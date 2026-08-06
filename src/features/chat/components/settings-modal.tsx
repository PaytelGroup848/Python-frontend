"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Shield, Sliders, ExternalLink, Key, Check } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "admin">("profile");
  const [savedNotice, setSavedNotice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const email = user?.email || "user@platform.com";
  const fullName = user?.full_name || (user?.email ? user.email.split("@")[0] : "User");
  const role = user?.role || "MEMBER";
  const avatarInitial = fullName.charAt(0).toUpperCase();
  const isAdmin = role.toUpperCase() === "ADMIN";

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Platform Settings</h2>
              <p className="text-xs text-slate-500">Manage your user account & AI environment preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY CONTAINER */}
        <div className="flex min-h-[380px]">
          {/* TABS SIDEBAR */}
          <div className="w-52 border-r border-slate-200 bg-slate-50/70 p-3 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "profile"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <User size={15} />
              Account Profile
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                activeTab === "preferences"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
              }`}
            >
              <Sliders size={15} />
              AI Preferences
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  activeTab === "admin"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-slate-200/60 hover:text-slate-900"
                }`}
              >
                <Shield size={15} />
                Admin Controls
              </button>
            )}
          </div>

          {/* TAB CONTENT */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-md shadow-emerald-600/20">
                    {avatarInitial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{fullName}</h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                        {role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{email}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={fullName}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      defaultValue={email}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === "preferences" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Default Output Tone</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none">
                    <option value="precise">Precise & Analytical (Default)</option>
                    <option value="creative">Creative & Conversational</option>
                    <option value="concise">Concise Bullet Points</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Response Streaming</label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="text-xs text-slate-700">Enable real-time token streaming</span>
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-emerald-600" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Context History Limit</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ADMIN TAB */}
            {activeTab === "admin" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Key size={16} className="text-emerald-600" />
                    Admin Control Center Access
                  </div>
                  <p className="text-xs text-slate-600">
                    Access dataset management, pipeline training jobs, models registry, and system telemetry in the Admin Control Dashboard.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/admin"
                      onClick={onClose}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20"
                    >
                      <span>Open Admin Control Dashboard</span>
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          {savedNotice ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <Check size={14} /> Settings saved successfully!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Enterprise AI Infrastructure v2.4</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
