"use client";

import { useState } from "react";

import { Loader2, AlertCircle } from "lucide-react";
import { ScanStatus } from "@/services/scan.service";
import { useScans } from "@/hooks/use-scan";
import ScanCard from "./scan-card";

const LIMIT = 50;

export default function ScanList() {
  const [status, setStatus] = useState<ScanStatus | "all">("all");
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, error } = useScans({
    status: status === "all" ? undefined : status,
    limit: LIMIT,
    offset,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const statusOptions: { value: ScanStatus | "all"; label: string }[] = [
    { value: "all", label: "All Scans" },
    { value: "done", label: "Completed" },
    { value: "processing", label: "Processing" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#f1f1f1] font-michroma">
              Scan Management
            </h1>
            <p className="text-sm text-[#888888] font-sf-pro mt-1">
              {data && (
                <>
                  Showing {data.scans.length} of {data.total.toLocaleString()}{" "}
                  scans
                </>
              )}
            </p>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium font-sf-pro text-[#f1f1f1] whitespace-nowrap"
            >
              Filter by:
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as ScanStatus | "all");
                setOffset(0);
              }}
              className="px-4 py-2 border border-[#FFFFFF33] rounded-lg bg-[#111111B2] text-sm font-medium text-[#888888] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading scans...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Error loading scans
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error instanceof Error
                  ? error.message
                  : "An unexpected error occurred"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scan List */}
      {!isLoading && !isError && data && (
        <>
          {data.scans.length === 0 ? (
            <div className="rounded-lg p-12 text-center">
              <p className="text-[#888888] font-sf-pro">
                No scans found with the selected filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.scans.map((scan) => (
                <ScanCard key={scan.scan_id} scan={scan} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-600">
                Page {currentPage} of {totalPages} · {total} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                  className="px-3 py-1.5 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setOffset(offset + LIMIT)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 font-michroma border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
