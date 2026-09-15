"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { PublicWorkspacePreview } from "@/components/auth/public-workspace-preview";
import { WorkspaceSkeleton } from "@/components/auth/workspace-skeleton";
import { useAuthStore } from "@/stores/auth-store";

function RegisterContent() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);

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
        initialMode="signup"
        onSuccess={() => router.push("/chat")}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <RegisterContent />
    </Suspense>
  );
}
