"use client";

import { useState } from "react";
import { useScanCorrections } from "@/hooks/useScanCorrections";
import { useQueryClient } from "@tanstack/react-query";
import { scanCorrectionKeys } from "@/hooks/useScanCorrections";
import { ScanCorrectionStatus } from "@/services/scanCorrectionService";
import { RefreshCw, ScanLine, Loader2 } from "lucide-react";
import ScanCorrectionCard from "./_components/scan-correction-card";

type Filter = ScanCorrectionStatus | "all";

const LIMIT = 50;

const filterOptions: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function ScanCorrectionsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();

  const params =
    filter === "all"
      ? { limit: LIMIT, offset }
      : { limit: LIMIT, offset, status: filter as ScanCorrectionStatus };

  const { data, isLoading, isError, isFetching, refetch } =
    useScanCorrections(params);

  const corrections = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handleFilterChange = (v: Filter) => {
    setFilter(v);
    setOffset(0);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Scan Corrections
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Review user-submitted corrections to scanned comic identification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: scanCorrectionKeys.lists(),
                })
              }
              disabled={isFetching}
              className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
            >
              <RefreshCw
                size={14}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-[#111111B2] font-michroma border border-[#FFFFFF33] rounded-xl p-1 w-full md:w-fit overflow-x-auto">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFilterChange(opt.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  color: filter === opt.value ? "#171717" : "#888888",
                  background: filter === opt.value ? "#C3F001" : "transparent",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-zinc-600">
              <Loader2 size={11} className="animate-spin" />
              Updating…
            </span>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-[#888888]" />
            <p className="text-sm font-sf-pro text-[#888888]">
              Loading scan corrections…
            </p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-20 gap-3">
            <ScanLine size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">
              Failed to load scan corrections.
            </p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : corrections.length === 0 ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-20 gap-3">
            <ScanLine size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No scan corrections found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {corrections.map((c) => (
              <ScanCorrectionCard key={c.correction_id} correction={c} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#888888] font-sf-pro">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                className="px-3 py-1.5 rounded-lg text-xs font-sf-pro bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setOffset(offset + LIMIT)}
                className="px-3 py-1.5 rounded-lg text-xs font-sf-pro bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
