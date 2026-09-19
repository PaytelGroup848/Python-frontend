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

let activeGuestProvisionPromise: Promise<void> | null = null;

function AuthGuardContent({ children }: AuthGuardProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const searchParams = useSearchParams();
  const authQuery = searchParams.get("auth");

  const [isInitializingGuest, setIsInitializingGuest] = useState(false);
  const [guestInitError, setGuestInitError] = useState(false);
  const isInitiatingRef = useRef(false);

  useEffect(() => {
    if (!hydrated) return;

    // 1. Stale token eviction / Proactive Refresh
    if (accessToken && isJwtExpired(accessToken)) {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken && !isJwtExpired(refreshToken)) {
        // Attempt proactive background refresh before purging
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
          fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          })
            .then(async (res) => {
              if (res.ok) {
                const data = await res.json();
                const currentUser = useAuthStore.getState().user;
                if (data.access_token && currentUser) {
                  setAuth(currentUser, data.access_token, refreshToken);
                  return;
                }
              }
              // Refresh failed: clear credentials
              useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
              try {
                localStorage.removeItem("ai-platform-auth");
              } catch {
                // ignore
              }
            })
            .catch(() => {
              useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
              try {
                localStorage.removeItem("ai-platform-auth");
              } catch {
                // ignore
              }
            });
          return;
        }
      }

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

    async function provisionGuest(attempt = 1) {
      // Cross-tab single-flight: check if store or localStorage already got a valid token
      const existingToken = useAuthStore.getState().accessToken;
      if (existingToken && !isJwtExpired(existingToken)) {
        if (isMounted) setIsInitializingGuest(false);
        isInitiatingRef.current = false;
        return;
      }

      if (isMounted) {
        setIsInitializingGuest(true);
        setGuestInitError(false);
      }

      const acquireAndInit = async () => {
        // Re-check both in-memory store and synchronous localStorage
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
          // Always commit valid token to global store regardless of micro-unmounts
          if (guestData?.access_token) {
            setAuth(guestData.user, guestData.access_token, guestData.refresh_token);
          }
        } catch (err) {
          console.warn("Guest session auto-provisioning failed with initId, attempting fresh fallback:", err);
          try {
            if (typeof window !== "undefined" && window.sessionStorage) {
              sessionStorage.removeItem("patwatoli_guest_init_id");
            }
            const freshGuestData = await authService.createGuestSession(undefined);
            if (freshGuestData?.access_token) {
              setAuth(freshGuestData.user, freshGuestData.access_token, freshGuestData.refresh_token);
            }
          } catch (fallbackErr) {
            console.error("Fresh guest session fallback also failed:", fallbackErr);
            throw fallbackErr;
          }
        }
      };

      if (!activeGuestProvisionPromise) {
        activeGuestProvisionPromise = (async () => {
          try {
            if (typeof window !== "undefined" && "locks" in navigator) {
              const abortController = new AbortController();
              const lockTimeoutId = setTimeout(() => abortController.abort(), 2500);
              try {
                await navigator.locks.request(
                  "patwatoli_guest_init",
                  { signal: abortController.signal },
                  async () => {
                    clearTimeout(lockTimeoutId);
                    await acquireAndInit();
                  }
                );
              } catch (lockErr) {
                // Lock queue timeout or abort: fallback immediately to direct acquisition
                clearTimeout(lockTimeoutId);
                await acquireAndInit();
              }
            } else {
              await acquireAndInit();
            }
          } finally {
            activeGuestProvisionPromise = null;
          }
        })();
      }

      try {
        await activeGuestProvisionPromise;
      } catch (provErr) {
        // Automatic single retry after 800ms before showing error UI
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 800));
          if (isMounted) {
            return provisionGuest(2);
          }
        }
        if (isMounted) {
          setGuestInitError(true);
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

  // 3. Fallback error state if network is completely unreachable
  if (guestInitError) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Connecting to AI Platform</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We couldn&apos;t automatically start your guest session. Please check your connection and try again.
          </p>
          <button
            onClick={() => {
              setGuestInitError(false);
              isInitiatingRef.current = false;
              activeGuestProvisionPromise = null;
              useAuthStore.getState().setHydrated(true);
            }}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // 4. Fallback when user did NOT explicitly request ?auth=login: Keep showing skeleton while provisioning completes
  if (authQuery !== "login") {
    return <WorkspaceSkeleton />;
  }

  // 5. Explicit ?auth=login: Render centered AuthModal
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