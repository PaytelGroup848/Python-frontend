"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { hasAdminAccess, isRouteRestricted } from "@/features/admin/utils/roles";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    // 1. If user is neither Super Admin nor Sub-Admin, redirect to chat
    if (!hasAdminAccess(user?.role)) {
      router.push("/chat");
      return;
    }

    // 2. If Sub-Admin attempts to access a restricted sub-route, redirect to /admin dashboard
    if (isRouteRestricted(user?.role, pathname)) {
      router.push("/admin");
    }
  }, [user, hydrated, router, pathname]);

  if (hydrated && !hasAdminAccess(user?.role)) {
    return null;
  }

  if (hydrated && isRouteRestricted(user?.role, pathname)) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminHeader />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}