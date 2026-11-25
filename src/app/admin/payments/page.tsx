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
import { usePayments } from "@/features/admin/hooks/use-payments";
import type { Payment } from "@/features/admin/types/payment";

type SortOrder = "desc" | "asc";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

export default function PaymentsPage() {
  const { data, isLoading, error } = usePayments();

  // Sorting State
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // 1. Sort payments deterministically
  const sortedPayments = useMemo(() => {
    if (!data?.payments) return [];
    return [...data.payments].sort((a, b) => {
      return sortOrder === "desc" ? b.id - a.id : a.id - b.id;
    });
  }, [data?.payments, sortOrder]);

  // 2. Compute pagination metrics
  const totalPayments = sortedPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalPayments / pageSize));

  // 3. Slice for current page
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPayments.slice(start, start + pageSize);
  }, [sortedPayments, currentPage, pageSize]);

  // Handlers
  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const startIndex = totalPayments === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalPayments);

  if (isLoading) {
    return <div className="p-6 text-zinc-500 font-medium">Loading payments...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500 font-medium">Failed to load payments</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      {/* Top Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Payments Management
            </h1>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {totalPayments} Payments
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor platform payments &bull; Sorted by ID ({sortOrder === "desc" ? "Newest first" : "Oldest first"})
          </p>
        </div>
      </div>

      {/* Main Table Container - Fills Available Height, Zero Cut-off */}
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
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Reference</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">User</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Provider</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Type</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Amount</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Currency</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Status</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Created</th>
                <th className="p-4 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-500">
                    No payments found.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment: Payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 rounded-md">
                        #{payment.id}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {payment.payment_reference}
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      User #{payment.user_id}
                    </td>
                    <td className="p-4">
                      <span className="inline-block rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 capitalize">
                        {payment.provider}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-block rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 capitalize">
                        {payment.payment_type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {payment.currency === "INR" ? "₹" : ""}
                      {payment.amount?.toLocaleString()}
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-600 dark:text-zinc-400 uppercase">
                      {payment.currency}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payment.status === "paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                            : payment.status === "pending"
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50"
                            : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            payment.status === "paid"
                              ? "bg-emerald-500"
                              : payment.status === "pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="capitalize">{payment.status}</span>
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="p-4">
                      <button
                        className="rounded-lg bg-blue-600/90 hover:bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
                      >
                        View
                      </button>
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
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">{totalPayments}</span> payments
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
