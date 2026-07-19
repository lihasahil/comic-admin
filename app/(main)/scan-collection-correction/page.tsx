"use client";

import { useState } from "react";
import { RefreshCw, ClipboardList, Loader2, Check, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useScanCollectionCorrections,
  scanCollectionCorrectionKeys,
} from "@/hooks/use-scan-collection-correction";
import {
  ScanCollectionCorrection,
  CorrectionStatus,
} from "@/services/scan-collection-correction.service";
import { ReviewCorrectionModal } from "./_components/review-correction-modal";
import { OtherFieldsDiff } from "./_components/other-fields-diff";

const LIMIT = 50;

type StatusFilter = CorrectionStatus | "all";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "All", value: "all" },
];

export default function ScanCollectionCorrectionsPage() {
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [offset, setOffset] = useState(0);
  const [reviewTarget, setReviewTarget] = useState<{
    correction: ScanCollectionCorrection;
    action: "approve" | "reject";
  } | null>(null);
  const queryClient = useQueryClient();

  const params = {
    limit: LIMIT,
    offset,
    ...(status !== "all" ? { status } : {}),
  };

  const { data, isLoading, isError, isFetching, refetch } =
    useScanCollectionCorrections(params);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  const handleStatusChange = (v: StatusFilter) => {
    setStatus(v);
    setOffset(0);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: scanCollectionCorrectionKeys.lists(),
    });
  };

  return (
    <div className="min-h-screen text-white">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-michroma tracking-tight text-white">
              Collection Corrections
            </h1>
            <p className="text-sm font-sf-pro text-zinc-500 mt-1">
              Review user-submitted corrections on scanned collection items
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

        {/* Status tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 bg-[#111111B2] font-michroma border border-[#FFFFFF33] rounded-xl p-1 w-full md:w-fit overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleStatusChange(tab.value)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  color: status === tab.value ? "#171717" : "#888888",
                  background: status === tab.value ? "#C3F001" : "transparent",
                }}
              >
                {tab.label}
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
            <Loader2 size={28} className="animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading corrections…</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ClipboardList size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">Failed to load corrections.</p>
            <button
              onClick={() => refetch()}
              className="text-xs text-amber-400 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ClipboardList size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">No corrections found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.correction_id}
                className="flex flex-col md:flex-row gap-4 font-sf-pro rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
              >
                <img
                  src={item.scan_thumbnail}
                  alt={item.system_found.title}
                  className="w-full md:w-24 h-32 md:h-32 object-cover rounded-md shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.system_found.title} #
                        {item.system_found.issue_number}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.system_found.publisher} · {item.system_found.year}{" "}
                        · {item.comic_scan_id}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-michroma px-2 py-1 rounded-full ${
                        item.status === "pending"
                          ? "bg-amber-500/10 text-amber-400"
                          : item.status === "approved"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Submitted by {item.user.full_name} ({item.user.email})
                  </p>

                  {(item.user_says.title ||
                    item.user_says.issue_number ||
                    item.user_says.publisher ||
                    item.user_says.year ||
                    item.user_says.barcode) && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-zinc-400">
                      {item.user_says.title && (
                        <p>User title: {item.user_says.title}</p>
                      )}
                      {item.user_says.issue_number && (
                        <p>User issue #: {item.user_says.issue_number}</p>
                      )}
                      {item.user_says.publisher && (
                        <p>User publisher: {item.user_says.publisher}</p>
                      )}
                      {item.user_says.year && (
                        <p>User year: {item.user_says.year}</p>
                      )}
                      {item.user_says.barcode && (
                        <p>User barcode: {item.user_says.barcode}</p>
                      )}
                    </div>
                  )}

                  {item.user_says.note && (
                    <p className="text-xs text-zinc-400 italic">
                      "{item.user_says.note}"
                    </p>
                  )}

                  <OtherFieldsDiff other_fields={item.other_fields} />

                  {item.admin_note && (
                    <p className="text-xs text-zinc-500">
                      Admin note: {item.admin_note}
                    </p>
                  )}

                  {item.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() =>
                          setReviewTarget({
                            correction: item,
                            action: "approve",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-michroma bg-[#C3F001] text-[#171717] hover:opacity-90"
                      >
                        <Check size={12} />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setReviewTarget({
                            correction: item,
                            action: "reject",
                          })
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500/10"
                      >
                        <X size={12} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[#888888] font-sf-pro">
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

      <ReviewCorrectionModal
        correction={reviewTarget?.correction ?? null}
        action={reviewTarget?.action ?? null}
        onClose={() => setReviewTarget(null)}
      />
    </div>
  );
}
