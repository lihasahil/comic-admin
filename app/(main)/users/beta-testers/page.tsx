"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Users, Loader2, ChevronLeft } from "lucide-react";
import { useBetaTesters, betaTesterKeys } from "@/hooks/use-beta-checklist";
import TesterCard from "./_components/tester-card";
import { useRouter } from "next/navigation";

const LIMIT = 20;

export default function BetaTestersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching, refetch } = useBetaTesters({
    page,
    limit: LIMIT,
  });

  const testers = data?.testers ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: betaTesterKeys.lists() });
  };

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Beta Testers
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Confirmed beta checklist testers
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#1A1A1A] border border-[#FFFFFF33] text-[#888888] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
            >
              <ChevronLeft size={14} />
              Back
            </button>

            <button
              onClick={handleRefresh}
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

        {/* Meta row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-zinc-500 font-sf-pro">
            {total} total tester{total !== 1 ? "s" : ""}
          </p>
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
            <Loader2 size={28} className="animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading testers…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load testers.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : testers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No beta testers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {testers.map((tester) => (
              <TesterCard key={tester.user_id} tester={tester} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#888888] font-sf-pro">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg text-xs bg-zinc-900 font-michroma border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
