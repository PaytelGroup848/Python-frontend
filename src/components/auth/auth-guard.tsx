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
    <div className="relative h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-200">
      {/* Ambient emerald glow waves matching product */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-200/40 dark:bg-emerald-950/20 blur-[120px]" />
        <div className="absolute bottom-[-160px] left-[-80px] h-[480px] w-[800px] rounded-full bg-teal-200/30 dark:bg-teal-950/15 blur-[120px]" />
      </div>

      <PublicWorkspacePreview />
      <AuthModal isOpen={true} canClose={false} />
    </div>
  );
}