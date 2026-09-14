"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  Maximize2,
  Copy,
  Check,
  X,
  Sparkles,
  Image as ImageIcon,
  Scissors,
  Loader2,
  Undo2,
} from "lucide-react";
import { removeImageBackground, upscaleImage4K } from "../services/media-studio-service";

interface ChatImageCardProps {
  src: string;
  alt?: string;
}

export function ChatImageCard({ src, alt = "AI Generated Artwork" }: ChatImageCardProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Studio states
  const backendBase = process.env.NEXT_PUBLIC_API_URL ||"https://api.patwatoliai.com" || "http://localhost:8000";
  const initialResolvedUrl = src.startsWith("http") ? src : `${backendBase}${src.startsWith("/") ? "" : "/"}${src}`;
  const [currentUrl, setCurrentUrl] = useState(initialResolvedUrl);
  const [transparentUrl, setTransparentUrl] = useState<string | null>(null);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Sync if prop changes
  useEffect(() => {
    const url = src.startsWith("http") ? src : `${backendBase}${src.startsWith("/") ? "" : "/"}${src}`;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUrl(url);
  }, [src, backendBase]);

  // Keyboard shortcut (Escape) and background scroll lock when lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(currentUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const sanitizedName = alt.slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_");
      const suffix = currentUrl === transparentUrl ? "_cutout" : currentUrl === upscaledUrl ? "_4k" : "";
      link.download = `${sanitizedName || "generated_artwork"}${suffix}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(currentUrl, "_blank");
    }
  };

  // 1-Click Background Removal handler
  const handleRemoveBg = async () => {
    if (isRemovingBg) return;
    try {
      setIsRemovingBg(true);
      setStatusMessage("Removing background...");
      const res = await removeImageBackground({ fileUrl: currentUrl });
      if (res.data?.file_url) {
        const fullUrl = res.data.file_url.startsWith("http")
          ? res.data.file_url
          : `${backendBase}${res.data.file_url.startsWith("/") ? "" : "/"}${res.data.file_url}`;
        setTransparentUrl(fullUrl);
        setCurrentUrl(fullUrl);
        setStatusMessage("Background removed (Transparent PNG)!");
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage(null);
      }
    } catch (err) {
      console.error("Background removal failed:", err);
      setStatusMessage(null);
      alert("Failed to remove background. Please try again.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  // 4K Upscale handler
  const handleUpscale = async () => {
    if (isUpscaling) return;
    try {
      setIsUpscaling(true);
      setStatusMessage("Upscaling to 4K Super-Resolution...");
      const res = await upscaleImage4K({ fileUrl: currentUrl, scale: 4 });
      if (res.data?.file_url) {
        const fullUrl = res.data.file_url.startsWith("http")
          ? res.data.file_url
          : `${backendBase}${res.data.file_url.startsWith("/") ? "" : "/"}${res.data.file_url}`;
        setUpscaledUrl(fullUrl);
        setCurrentUrl(fullUrl);
        setStatusMessage("Upscaled to 4K Ultra HD!");
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        setStatusMessage(null);
      }
    } catch (err) {
      console.error("Upscale failed:", err);
      setStatusMessage(null);
      alert("Failed to upscale image. Please try again.");
    } finally {
      setIsUpscaling(false);
    }
  };

  // Toggle original vs cutout/upscale
  const handleToggleOriginal = () => {
    if (currentUrl === initialResolvedUrl) {
      if (transparentUrl) setCurrentUrl(transparentUrl);
      else if (upscaledUrl) setCurrentUrl(upscaledUrl);
    } else {
      setCurrentUrl(initialResolvedUrl);
    }
  };

  const isCutoutActive = transparentUrl && currentUrl === transparentUrl;
  const is4KActive = upscaledUrl && currentUrl === upscaledUrl;
  const hasModifiedVersion = Boolean(transparentUrl || upscaledUrl);

  if (error) {
    return (
      <div className="my-3 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs text-rose-800">
        <ImageIcon className="h-5 w-5 shrink-0 text-rose-500" />
        <div>
          <p className="font-semibold">Unable to load image asset</p>
          <p className="text-rose-600/90">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group relative my-3 max-w-md md:max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900/5 shadow-md transition-shadow duration-200 hover:shadow-lg">
        {/* SKELETON SHIMMER PLACEHOLDER */}
        {!loaded && (
          <div className="flex aspect-square w-full animate-pulse flex-col items-center justify-center gap-2 bg-linear-to-r from-slate-100 via-emerald-50 to-slate-100 text-slate-400">
            <Sparkles className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="text-xs font-semibold text-slate-600">Generating preview...</span>
          </div>
        )}

        {/* STATUS TOAST NOTIFICATION */}
        {statusMessage && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-md backdrop-blur-md animate-in fade-in">
            <Sparkles className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* BADGES */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 pointer-events-none">
          {isCutoutActive && (
            <span className="rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
              Transparent PNG
            </span>
          )}
          {is4KActive && (
            <span className="rounded-md bg-indigo-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
              4K Ultra HD
            </span>
          )}
        </div>

        {/* IMAGE WITH OPTIONAL TRANSPARENCY CHECKERBOARD */}
        <div className={isCutoutActive ? "bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[12px_12px] bg-slate-100/80" : ""}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            onClick={() => setLightboxOpen(true)}
            className={`w-full h-auto object-contain transition-opacity duration-200 cursor-pointer ${
              loaded ? "opacity-100 block" : "opacity-0 absolute inset-0 pointer-events-none"
            }`}
            loading="lazy"
          />
        </div>

        {/* FLOATING ACTION TOOLBAR (TOP RIGHT) */}
        {loaded && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-xl bg-slate-900/75 p-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md z-10">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              title="Full screen view"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <Maximize2 size={14} />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              title="Download asset"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <Download size={14} />
            </button>
            <button
              type="button"
              onClick={handleCopyUrl}
              title={copied ? "Copied!" : "Copy image URL"}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        )}

        {/* STUDIO ACTION BAR */}
        {loaded && (
          <div className="flex flex-col border-t border-slate-200/80 bg-white/95 text-xs backdrop-blur-xs">
            {/* Quick 1-Click Studio Tools */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50/90 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRemoveBg}
                  disabled={isRemovingBg || Boolean(transparentUrl && currentUrl === transparentUrl)}
                  title="Remove background to create transparent PNG"
                  className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/70 transition disabled:opacity-50 cursor-pointer"
                >
                  {isRemovingBg ? <Loader2 size={11} className="animate-spin text-emerald-600" /> : <Scissors size={11} />}
                  <span>Remove BG</span>
                </button>

                <button
                  type="button"
                  onClick={handleUpscale}
                  disabled={isUpscaling || Boolean(upscaledUrl && currentUrl === upscaledUrl)}
                  title="Enhance detail with 4K super-resolution upscaling"
                  className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200/70 transition disabled:opacity-50 cursor-pointer"
                >
                  {isUpscaling ? <Loader2 size={11} className="animate-spin text-indigo-600" /> : <Sparkles size={11} />}
                  <span>4K Upscale</span>
                </button>

                {hasModifiedVersion && (
                  <button
                    type="button"
                    onClick={handleToggleOriginal}
                    title={currentUrl === initialResolvedUrl ? "Switch to edited version" : "Switch to original image"}
                    className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/70 transition cursor-pointer"
                  >
                    <Undo2 size={11} />
                    <span>{currentUrl === initialResolvedUrl ? "View Edit" : "Original"}</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownload}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer shrink-0"
              >
                Download
              </button>
            </div>

            {/* Prompt description */}
            {alt && (
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-600">
                <Sparkles size={12} className="text-emerald-600 shrink-0" />
                <span className="truncate text-[11px]">{alt}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && mounted && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-999999 flex flex-col items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* TOP BAR */}
          <div
            className="flex w-full max-w-5xl items-center justify-between pb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 truncate text-sm font-medium">
              <Sparkles size={15} className="text-emerald-400" />
              <span className="truncate max-w-lg">{alt}</span>
              {isCutoutActive && (
                <span className="rounded-md bg-emerald-500/80 px-2 py-0.5 text-[10px] font-bold text-white">
                  Transparent Cutout
                </span>
              )}
              {is4KActive && (
                <span className="rounded-md bg-indigo-600/80 px-2 py-0.5 text-[10px] font-bold text-white">
                  4K Ultra HD
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRemoveBg}
                disabled={isRemovingBg}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isRemovingBg ? <Loader2 size={13} className="animate-spin text-emerald-400" /> : <Scissors size={13} />}
                <span>Remove BG</span>
              </button>
              <button
                type="button"
                onClick={handleUpscale}
                disabled={isUpscaling}
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isUpscaling ? <Loader2 size={13} className="animate-spin text-indigo-400" /> : <Sparkles size={13} />}
                <span>4K Upscale</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/25 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* LIGHTBOX MAIN IMAGE */}
          <div
            className={`relative flex max-h-[85vh] max-w-5xl items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl ${
              isCutoutActive ? "bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-size-[16px_16px] bg-slate-900/90" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentUrl}
              alt={alt}
              className="max-h-[85vh] max-w-full object-contain rounded-2xl"
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
