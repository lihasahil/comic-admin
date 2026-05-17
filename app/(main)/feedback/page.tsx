"use client";

import { useState } from "react";
import { useFeedbacks, FeedbackStatus } from "@/hooks/useFeedback";

import { RefreshCw, MessageSquareDashed, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { feedbackKeys } from "@/hooks/useFeedback";
import FeedbackStats from "./_components/FeedbackStats";
import FeedbackFilter from "./_components/FeedbackFilter";
import FeedbackCard from "./_components/FeedbackCard";

type FilterOption = FeedbackStatus | "all";

const LIMIT = 50;

export default function FeedbackPage() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [offset, setOffset] = useState(0);
  const queryClient = useQueryClient();

  const params =
    filter === "all"
      ? { limit: LIMIT, offset }
      : { limit: LIMIT, offset, status: filter };

  const { data, isLoading, isError, isFetching, refetch } =
    useFeedbacks(params);

  const feedbacks = data?.feedbacks ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: feedbackKeys.lists() });
  };

  const handleFilterChange = (v: FilterOption) => {
    setFilter(v);
    setOffset(0);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-[#F1F1F1]">
              Feedback
            </h1>
            <p className="text-sm text-[#888888] mt-1">
              Review and moderate user-submitted feedback
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center justify-center font-michroma w-full md:w-xs bg-[#C3F001] text-[#171717] gap-2 rounded-lg px-5 py-2.5 text-[14px] transition-opacity hover:opacity-90 active:opacity-80"
          >
            <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {data && <FeedbackStats feedbacks={feedbacks} total={total} />}

        {/* Filter */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <FeedbackFilter value={filter} onChange={handleFilterChange} />
          {isFetching && !isLoading && (
            <span className="flex items-center font-sf-pro gap-1.5 text-xs text-zinc-600">
              <Loader2 size={11} className="animate-spin" />
              Updating…
            </span>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col font-sf-pro items-center justify-center py-20 gap-3">
            <Loader2 size={28} className="animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading feedback…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col font-sf-pro items-center justify-center py-20 gap-3">
            <MessageSquareDashed size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load feedback.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center font-sf-pro justify-center py-20 gap-3">
            <MessageSquareDashed size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No feedback found.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-1">
            {feedbacks.map((fb) => (
              <FeedbackCard key={fb.feedback_id} feedback={fb} />
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
      </div>
    </div>
  );
}
