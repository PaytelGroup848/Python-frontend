"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/features/auth/services/auth.service";
import { WorkspaceSkeleton } from "./workspace-skeleton";
import { PublicWorkspacePreview } from "./public-workspace-preview";
import { AuthModal } from "./auth-modal";

interface AuthGuardProps {
  children: React.ReactNode;
}

function AuthGuardContent({ children }: AuthGuardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const searchParams = useSearchParams();
  const authQuery = searchParams.get("auth");

  const [isInitializingGuest, setIsInitializingGuest] = useState(false);
  const isInitiatingRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    // Already authenticated (registered user or active guest session)
    if (accessToken) return;

    // User explicitly requested login via ?auth=login
    if (authQuery === "login") return;

    if (isInitiatingRef.current) return;
    isInitiatingRef.current = true;

    let isMounted = true;

    async function provisionGuest() {
      // 1. Cross-tab single-flight: check if another tab already obtained a guest token
      const existingToken = useAuthStore.getState().accessToken;
      if (existingToken) {
        if (isMounted) setIsInitializingGuest(false);
        return;
      }

      if (isMounted) setIsInitializingGuest(true);

      const acquireAndInit = async () => {
        // Re-check inside mutex both in-memory store and synchronous localStorage
        let currentToken = useAuthStore.getState().accessToken;
        if (!currentToken && typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("ai-platform-auth");
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed?.state?.accessToken && parsed?.state?.user) {
                setAuth(parsed.state.user, parsed.state.accessToken, parsed.state.refreshToken || "");
                return;
              }
            }
          } catch {
            // ignore
          }
        }
        if (currentToken) return;

        try {
          let initId = "";
          if (typeof window !== "undefined" && window.sessionStorage) {
            initId = sessionStorage.getItem("patwatoli_guest_init_id") || "";
            if (!initId) {
              initId = Math.random().toString(36).substring(2) + Date.now().toString(36);
              sessionStorage.setItem("patwatoli_guest_init_id", initId);
            }
          }
          const guestData = await authService.createGuestSession(initId || undefined);
          if (isMounted && guestData?.access_token) {
            setAuth(guestData.user, guestData.access_token, guestData.refresh_token);
          }
        } catch (err) {
          console.warn("Guest session auto-provisioning failed:", err);
        }
      };

      try {
        if (typeof window !== "undefined" && "locks" in navigator) {
          await navigator.locks.request("patwatoli_guest_init", acquireAndInit);
        } else {
          await acquireAndInit();
        }
      } finally {
        if (isMounted) {
          setIsInitializingGuest(false);
        }
      }
    }

    provisionGuest();

    return () => {
      isMounted = false;
    };
  }, [hydrated, accessToken, authQuery, setAuth]);

  // 1. Loading / Hydration / Guest Provisioning Phase: Render skeleton
  if (!hydrated || isInitializingGuest) {
    return <WorkspaceSkeleton />;
  }

  // 2. Authenticated (Registered user or Guest user): Render real workspace directly
  if (accessToken) {
    return <>{children}</>;
  }

  // 3. Unauthenticated (Explicit ?auth=login or fallback): Render centered AuthModal
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

export function AuthGuard({ children }: AuthGuardProps) {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <AuthGuardContent>{children}</AuthGuardContent>
    </Suspense>
  );
}