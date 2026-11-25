"use client";

import { useState, useMemo } from "react";
import {
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useUsers } from "@/features/admin/hooks/use-users";
import type { User } from "@/features/admin/services/user-service";
import { useUpdateUserStatus } from "@/features/admin/hooks/use-update-user-status";
import { useUpdateUserPlan } from "@/features/admin/hooks/use-update-user-plan";
import { useAuthStore } from "@/stores/auth-store";
import { hasCapability } from "@/features/admin/utils/roles";

type SortOrder = "desc" | "asc";

/**
 * Format ISO datetime string to clean localized display:
 * e.g. "24 Nov 2026, 03:45 PM"
 */
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "-";
  }
}

/**
 * Convert 2-letter ISO country code into Unicode flag emoji.
 * e.g. "IN" -> 🇮🇳, "US" -> 🇺🇸
 */
function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "";
  }
}

/**
 * Format location with country flag and city/country
 */
function formatLocation(city?: string | null, country?: string | null): { flag: string; label: string } {
  if (!city && !country) {
    return { flag: "", label: "-" };
  }
  const flag = getCountryFlag(country);
  if (city && country) {
    return { flag, label: `${city}, ${country.toUpperCase()}` };
  }
  if (city) {
    return { flag: "", label: city };
  }
  return { flag, label: country ? country.toUpperCase() : "-" };
}

export default function UsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const canUpdatePlan = hasCapability(currentUser?.role, "users.plan.update");
  const canUpdateStatus = hasCapability(currentUser?.role, "users.status.update");

  // Sorting State
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const { data, isLoading, error } = useUsers();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdateUserPlan();

  // 1. Sort users deterministically
  const sortedUsers = useMemo(() => {
    if (!data?.users) return [];
    return [...data.users].sort((a, b) => {
      return sortOrder === "desc" ? b.id - a.id : a.id - b.id;
    });
  }, [data?.users, sortOrder]);

  // 2. Compute pagination metrics
  const totalUsers = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  // 3. Slice for current page
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Handlers
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to page 1 on page size change
  };

  const startIndex = totalUsers === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalUsers);

  if (isLoading) {
    return <div className="p-6 text-zinc-500 font-medium">Loading users...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 font-medium">Failed to load users</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      {/* Top Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              User Management
            </h1>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {totalUsers} Users
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Platform users overview &bull; Sorted by ID ({sortOrder === "desc" ? "Newest first" : "Oldest first"})
          </p>
        </div>
      </div>

      {/* Main Table Container - Fills Available Height, No White Gap */}
      <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Scrollable table wrapper with sticky header */}
        <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0 [scrollbar-width:thin]">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-20 bg-zinc-50/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
              <tr>
                <th
                  onClick={toggleSort}
                  className="p-4 cursor-pointer select-none group hover:bg-zinc-100/80 dark:hover:bg-slate-800 transition-colors"
                  title="Click to toggle sorting"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-300">
                    <span>ID</span>
                    {sortOrder === "desc" ? (
                      <ArrowDown size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    ) : (
                      <ArrowUp size={14} className="text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Name</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Email</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Role</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Plan</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Joined Date</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Location</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Used</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Limit</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Remaining</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Status</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-zinc-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: User) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-md">
                        #{user.id}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">{user.name}</td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-400 font-mono text-xs">{user.email}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {canUpdatePlan ? (
                        <select
                          className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition"
                          value={user.plan_name ?? "free"}
                          disabled={isUpdatingPlan}
                          onChange={(e) => {
                            updatePlan({
                              userId: user.id,
                              planName: e.target.value,
                            });
                          }}
                        >
                          <option value="free">FREE TIER</option>
                          <option value="pro">PRO TIER</option>
                          <option value="enterprise">ENTERPRISE TIER</option>
                        </select>
                      ) : (
                        <span className="inline-block rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase">
                          {user.plan_name ?? "free"}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="p-4 text-xs whitespace-nowrap">
                      {(() => {
                        const loc = formatLocation(user.city, user.country);
                        if (loc.label === "-") {
                          return <span className="text-zinc-400 dark:text-zinc-600">-</span>;
                        }
                        return (
                          <span className="inline-flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/80 px-2 py-0.5 rounded-md text-xs">
                            {loc.flag && <span className="text-sm leading-none">{loc.flag}</span>}
                            <span>{loc.label}</span>
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-4 font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {(user.total_tokens ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-500">
                      {(user.monthly_token_limit ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {(user.remaining_tokens ?? 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.is_active
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                            : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      {canUpdateStatus ? (
                        <button
                          disabled={isUpdatingStatus}
                          onClick={() =>
                            updateStatus({
                              userId: user.id,
                              isActive: !user.is_active,
                            })
                          }
                          className={
                            user.is_active
                              ? "rounded-lg bg-red-600/90 hover:bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                              : "rounded-lg bg-emerald-600/90 hover:bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                          }
                        >
                          {user.is_active ? "Block" : "Unblock"}
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Silicon Valley Standard Pagination Bar */}
        <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-slate-900/80 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          {/* Left: Range Info */}
          <div>
            Showing <span className="font-semibold text-zinc-900 dark:text-zinc-200">{startIndex}</span> to{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{endIndex}</span> of{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{totalUsers}</span> users
          </div>

          {/* Center: Rows per page selector */}
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Right: Page Navigation Controls */}
          <div className="flex items-center gap-1.5">
            <span className="mr-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="First Page"
            >
              <ChevronsLeft size={16} />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-slate-800 hover:bg-zinc-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Last Page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
