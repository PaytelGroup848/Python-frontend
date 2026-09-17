"use client";

import { useState } from "react";
import {
  Image as ImageIcon,
  Search,
  Trash2,
  Download,
  Maximize2,
  Copy,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Layers,
  Calendar,
  User,
} from "lucide-react";
import { useAdminMedia, useDeleteAdminMedia } from "@/features/admin/hooks/use-admin-media";
import type { AdminMediaItem } from "@/features/admin/services/media-service";
import { useAuthStore } from "@/stores/auth-store";
import { hasCapability } from "@/features/admin/utils/roles";

export default function AdminMediaPage() {
  const currentUser = useAuthStore((state) => state.user);
  const canDeleteMedia = hasCapability(currentUser?.role, "media.delete");

  const [page, setPage] = useState(1);
  const [provider, setProvider] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activePreview, setActivePreview] = useState<AdminMediaItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useAdminMedia({
    page,
    limit: 12,
    provider: provider || undefined,
    search: searchTerm || undefined,
  });

  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteAdminMedia();

  const backendBase = process.env.NEXT_PUBLIC_API_URL || "https://api.patwatoliai.com" || "http://localhost:8000";

  const handleCopyPrompt = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownload = async (media: AdminMediaItem) => {
    try {
      const fullUrl = media.file_url.startsWith("http")
        ? media.file_url
        : `${backendBase}${media.file_url.startsWith("/") ? "" : "/"}${media.file_url}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const sanitized = media.original_prompt.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_");
      link.download = `${sanitized || "media_asset"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(media.file_url, "_blank");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Media Assets Gallery</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse, inspect, and manage all AI-generated images across the platform.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Refresh Gallery</span>
        </button>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by prompt keywords..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={provider}
            onChange={(e) => {
              setProvider(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-hidden cursor-pointer"
          >
            <option value="">All Providers</option>
            <option value="flux">Flux Engine</option>
            <option value="openai">OpenAI DALL-E</option>
          </select>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Generated</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Active Page</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {data?.page ?? 1} / {data?.pages ?? 1}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Current Provider Filter</p>
          <p className="text-sm font-bold text-slate-800 uppercase mt-2">
            {provider || "All Engines"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Storage Type</p>
          <p className="text-sm font-bold text-slate-800 mt-2">Date-Partitioned</p>
        </div>
      </div>

      {/* CONTENT / GALLERY GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800">
          Failed to load media assets. Please ensure backend services are active.
        </div>
      ) : data?.images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ImageIcon size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No media assets found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing your search or provider filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.images.map((item) => {
            const fullUrl = item.file_url.startsWith("http")
              ? item.file_url
              : `${backendBase}${item.file_url.startsWith("/") ? "" : "/"}${item.file_url}`;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg"
              >
                {/* THUMBNAIL WRAPPER */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fullUrl}
                    alt={item.original_prompt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setActivePreview(item)}
                    loading="lazy"
                  />

                  {/* HOVER ACTION BAR */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <button
                      onClick={() => setActivePreview(item)}
                      title="Inspect full resolution"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(item)}
                      title="Download PNG"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(item.id, item.original_prompt)}
                      title={copiedId === item.id ? "Copied!" : "Copy prompt"}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                    {canDeleteMedia && (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Delete asset"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/80 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* TOP BADGE: PROVIDER */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    <Sparkles size={10} className="text-emerald-400" />
                    <span className="uppercase">{item.provider}</span>
                  </div>

                  {/* TOP BADGE: ASPECT RATIO */}
                  {item.aspect_ratio && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-medium text-slate-200 backdrop-blur-md">
                      <Layers size={10} />
                      <span>{item.aspect_ratio}</span>
                    </div>
                  )}
                </div>

                {/* CARD BODY */}
                <div className="flex flex-1 flex-col p-3.5 justify-between gap-2">
                  <p
                    className="text-xs text-slate-800 line-clamp-2 font-medium"
                    title={item.original_prompt}
                  >
                    {item.original_prompt}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <User size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate max-w-[110px]" title={item.user_email || item.user_name}>
                        {item.user_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-slate-400">
                      <Calendar size={11} />
                      <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-semibold text-slate-800">{data.page}</span> of{" "}
            <span className="font-semibold text-slate-800">{data.pages}</span> ({data.total} total assets)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page >= data.pages}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW MODAL */}
      {activePreview && (
        <div
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="flex w-full max-w-4xl items-center justify-between pb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate text-sm font-medium">
              <Sparkles size={15} className="text-emerald-400" />
              <span className="truncate max-w-lg">{activePreview.original_prompt}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload(activePreview)}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download HD</span>
              </button>
              <button
                onClick={() => setActivePreview(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            className="relative flex max-h-[80vh] max-w-4xl items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                activePreview.file_url.startsWith("http")
                  ? activePreview.file_url
                  : `${backendBase}${activePreview.file_url.startsWith("/") ? "" : "/"}${activePreview.file_url}`
              }
              alt={activePreview.original_prompt}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId !== null && canDeleteMedia && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Delete Media Asset?</h3>
            <p className="text-xs text-slate-500 mt-2">
              This action will permanently delete this image asset from both disk storage and the database ledger. This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMedia(deleteConfirmId, {
                    onSuccess: () => setDeleteConfirmId(null),
                  });
                }}
                disabled={isDeleting}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

