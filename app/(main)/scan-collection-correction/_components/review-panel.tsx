"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { useReviewScanCollectionCorrection } from "@/hooks/use-scan-collection-correction";
import { CorrectionStatus } from "@/services/scan-collection-correction.service";

export default function ReviewPanel({
  correctionId,
  currentStatus,
  currentNote,
  selectedCatalogId,
  identityDisputed,
  onReviewed,
}: {
  correctionId: number;
  currentStatus: CorrectionStatus;
  currentNote: string | null;
  selectedCatalogId: number | null;
  identityDisputed: boolean;
  onReviewed?: () => void;
}) {
  const [adminNote, setAdminNote] = useState(currentNote ?? "");
  const { mutate, isPending, error } = useReviewScanCollectionCorrection();
  const router = useRouter();

  useEffect(() => {
    setAdminNote(currentNote ?? "");
  }, [currentNote]);

  const blockedOnCatalogId = identityDisputed && !selectedCatalogId;

  const handleReview = (action: "approve" | "reject") => {
    if (action === "approve" && blockedOnCatalogId) return;

    mutate(
      {
        correctionId,
        payload: {
          action,
          ...(action === "approve" && selectedCatalogId
            ? { catalog_comic_id: selectedCatalogId }
            : {}),
          ...(adminNote.trim() ? { admin_note: adminNote.trim() } : {}),
        },
      },
      {
        onSuccess: () => {
          if (onReviewed) onReviewed();
          else router.push("/scan-collection-corrections");
        },
      },
    );
  };

  if (currentStatus !== "pending") {
    return (
      <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4">
        <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium mb-2">
          Review
        </p>
        <span
          className={`inline-block text-[10px] font-michroma px-2 py-1 rounded-full ${
            currentStatus === "approved"
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {currentStatus.toUpperCase()}
        </span>
        {currentNote && (
          <p className="text-xs text-zinc-500 mt-2 font-sf-pro">
            Note: {currentNote}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#111111B2] border border-[#FFFFFF33] p-4 space-y-3">
      <p className="text-xs text-[#F1F1F1] font-michroma uppercase tracking-wider font-medium">
        Review
      </p>

      <div className="text-xs font-sf-pro">
        {selectedCatalogId ? (
          <p className="text-zinc-400">
            Catalog match:{" "}
            <span className="text-white font-mono">{selectedCatalogId}</span>
          </p>
        ) : (
          <p className={identityDisputed ? "text-amber-400" : "text-zinc-500"}>
            {identityDisputed
              ? "Identity disputed — select a catalog match below before approving."
              : "No catalog match selected. Approving will keep the existing match."}
          </p>
        )}
      </div>

      <div>
        <label className="text-xs text-zinc-500 font-sf-pro">
          Admin note (optional, shown to user)
        </label>
        <textarea
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-zinc-600 resize-none"
          placeholder="Optional note…"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 font-sf-pro">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => handleReview("approve")}
          disabled={isPending || blockedOnCatalogId}
          title={
            blockedOnCatalogId
              ? "Select a catalog match to approve a disputed identity"
              : undefined
          }
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-michroma bg-[#C3F001] text-[#171717] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Check size={12} />
          )}
          Approve
        </button>
        <button
          onClick={() => handleReview("reject")}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-michroma bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <X size={12} />
          )}
          Reject
        </button>
      </div>
    </div>
  );
}
