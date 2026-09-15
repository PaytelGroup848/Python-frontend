"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { PublicWorkspacePreview } from "@/components/auth/public-workspace-preview";
import { WorkspaceSkeleton } from "@/components/auth/workspace-skeleton";
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
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center">
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
