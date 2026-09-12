"use client";

import { useAuthStore } from "@/stores/auth-store";
import { WorkspaceSkeleton } from "./workspace-skeleton";
import { PublicWorkspacePreview } from "./public-workspace-preview";
import { AuthModal } from "./auth-modal";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);

  // 1. Loading / Hydration Phase: Render skeleton to prevent modal flicker for authenticated users
  if (!hydrated) {
    return <WorkspaceSkeleton />;
  }

  // 2. Authenticated: Render real protected workspace directly
  if (accessToken) {
    return <>{children}</>;
  }

  // 3. Unauthenticated: Render safe mock shell (zero private data/network requests) + centered AuthModal
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <PublicWorkspacePreview />
      <AuthModal isOpen={true} canClose={false} />
    </div>
  );
}