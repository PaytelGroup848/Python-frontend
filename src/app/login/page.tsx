"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { PublicWorkspacePreview } from "@/components/auth/public-workspace-preview";
import { WorkspaceSkeleton } from "@/components/auth/workspace-skeleton";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuthStore } from "@/stores/auth-store";

function LoginContent() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode") || searchParams.get("auth");
  const initialMode = modeParam === "signup" ? "signup" : "login";

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/chat");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated) {
    return <WorkspaceSkeleton />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-200">
      {/* Ambient emerald glow waves matching product */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-200/40 dark:bg-emerald-950/20 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[480px] w-[800px] rounded-full bg-teal-200/30 dark:bg-teal-950/15 blur-[120px]" />
      </div>

      {/* Floating Day/Night Theme Toggle */}
      <div className="fixed top-5 right-5 z-[100000]">
        <ThemeToggle />
      </div>

      <PublicWorkspacePreview />
      <AuthModal
        isOpen={true}
        canClose={false}
        initialMode={initialMode}
        onSuccess={() => router.push("/chat")}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
