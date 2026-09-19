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

/**
 * Checks whether a JWT token is expired or invalid without external libraries.
 * Adds a 10-second buffer to proactively prevent 401 race conditions.
 */
function isJwtExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return payload.exp * 1000 <= Date.now() + 10000;
  } catch {
    return true;
  }
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

    // 1. Stale token eviction: If current token is expired, purge it immediately
    if (accessToken && isJwtExpired(accessToken)) {
      console.warn("Stale or expired access token detected; purging and auto-provisioning guest session.");
      useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
      try {
        localStorage.removeItem("ai-platform-auth");
      } catch {
        // ignore
      }
      isInitiatingRef.current = false;
      return;
    }

    // 2. Already authenticated with a valid active session (registered user or guest)
    if (accessToken) return;

    // 3. User explicitly requested login via ?auth=login
    if (authQuery === "login") return;

    if (isInitiatingRef.current) return;
    isInitiatingRef.current = true;

    let isMounted = true;

    async function provisionGuest() {
      // Cross-tab single-flight: check if another tab already obtained a valid guest token
      const existingToken = useAuthStore.getState().accessToken;
      if (existingToken && !isJwtExpired(existingToken)) {
        if (isMounted) setIsInitializingGuest(false);
        isInitiatingRef.current = false;
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
              const storedToken = parsed?.state?.accessToken;
              const storedUser = parsed?.state?.user;
              if (storedToken && storedUser) {
                if (!isJwtExpired(storedToken)) {
                  setAuth(storedUser, storedToken, parsed?.state?.refreshToken || "");
                  return;
                } else {
                  // Purge stale expired token from storage so it does not resurrect
                  localStorage.removeItem("ai-platform-auth");
                }
              }
            }
          } catch {
            // ignore
          }
        }
        if (currentToken && !isJwtExpired(currentToken)) return;

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
          console.warn("Guest session auto-provisioning failed with initId, attempting fresh fallback:", err);
          try {
            if (typeof window !== "undefined" && window.sessionStorage) {
              sessionStorage.removeItem("patwatoli_guest_init_id");
            }
            const freshGuestData = await authService.createGuestSession(undefined);
            if (isMounted && freshGuestData?.access_token) {
              setAuth(freshGuestData.user, freshGuestData.access_token, freshGuestData.refresh_token);
            }
          } catch (fallbackErr) {
            console.error("Fresh guest session fallback also failed:", fallbackErr);
          }
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
        isInitiatingRef.current = false;
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

  // 2. Authenticated (Registered user or Guest user with valid token): Render real workspace directly
  if (accessToken && !isJwtExpired(accessToken)) {
    return <>{children}</>;
  }

  // 3. Fallback when user did NOT explicitly request ?auth=login: Keep showing skeleton while provisioning
  if (authQuery !== "login") {
    return <WorkspaceSkeleton />;
  }

  // 4. Explicit ?auth=login: Render centered AuthModal
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